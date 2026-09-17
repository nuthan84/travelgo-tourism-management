package com.travelgo.service;

import com.travelgo.dto.PaymentDTO;
import com.travelgo.dto.PaymentVerifyRequest;
import com.travelgo.entity.*;
import com.travelgo.exception.BadRequestException;
import com.travelgo.repository.BookingRepository;
import com.travelgo.repository.PaymentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class PaymentServiceTest {

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private PaymentRepository paymentRepository;

    @InjectMocks
    private PaymentService paymentService;

    private Booking testBooking;
    private User testUser;
    private Payment testPayment;

    private static final String TEST_SECRET = "test_key_secret_xyz123";

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail("john@example.com");

        testBooking = new Booking();
        testBooking.setId(10L);
        testBooking.setBookingReference("TGK-2026-1115-1234");
        testBooking.setUser(testUser);
        testBooking.setTotalAmount(new BigDecimal("19948.95"));
        testBooking.setStatus(BookingStatus.PENDING);
        testBooking.setTravelDate(LocalDate.of(2026, 11, 15));

        testPayment = new Payment();
        testPayment.setId(5L);
        testPayment.setBooking(testBooking);
        testPayment.setRazorpayOrderId("order_test_123");
        testPayment.setAmount(new BigDecimal("19948.95"));
        testPayment.setStatus(PaymentStatus.CREATED);
    }

    @Test
    void testCreateOrderThrowsWhenCredentialsNotConfigured() {
        ReflectionTestUtils.setField(paymentService, "razorpayKeyId", "");
        ReflectionTestUtils.setField(paymentService, "razorpayKeySecret", "");

        when(bookingRepository.findById(10L)).thenReturn(Optional.of(testBooking));

        BadRequestException ex = assertThrows(BadRequestException.class, () ->
                paymentService.createOrder(10L, "john@example.com", false));

        assertTrue(ex.getMessage().contains("Razorpay Test Mode credentials are not configured"));
        assertEquals(BookingStatus.PENDING, testBooking.getStatus());
    }

    @Test
    void testVerifyPaymentThrowsWhenSecretNotConfigured() {
        ReflectionTestUtils.setField(paymentService, "razorpayKeySecret", "");

        when(bookingRepository.findById(10L)).thenReturn(Optional.of(testBooking));
        when(paymentRepository.findByBookingId(10L)).thenReturn(Optional.of(testPayment));

        PaymentVerifyRequest request = new PaymentVerifyRequest();
        request.setBookingId(10L);
        request.setRazorpayOrderId("order_test_123");
        request.setRazorpayPaymentId("pay_test_456");
        request.setRazorpaySignature("sig_any");

        BadRequestException ex = assertThrows(BadRequestException.class, () ->
                paymentService.verifyPayment(request, "john@example.com", false));

        assertTrue(ex.getMessage().contains("Razorpay Key Secret is not configured"));
        assertEquals(BookingStatus.PENDING, testBooking.getStatus());
        assertEquals(PaymentStatus.CREATED, testPayment.getStatus());
    }

    @Test
    void testVerifyPaymentFailsWithInvalidSignature() {
        ReflectionTestUtils.setField(paymentService, "razorpayKeySecret", TEST_SECRET);

        when(bookingRepository.findById(10L)).thenReturn(Optional.of(testBooking));
        when(paymentRepository.findByBookingId(10L)).thenReturn(Optional.of(testPayment));
        when(paymentRepository.save(any(Payment.class))).thenReturn(testPayment);

        PaymentVerifyRequest request = new PaymentVerifyRequest();
        request.setBookingId(10L);
        request.setRazorpayOrderId("order_test_123");
        request.setRazorpayPaymentId("pay_test_456");
        request.setRazorpaySignature("invalid_signature_string");

        BadRequestException ex = assertThrows(BadRequestException.class, () ->
                paymentService.verifyPayment(request, "john@example.com", false));

        assertTrue(ex.getMessage().contains("Invalid Razorpay signature"));
        assertEquals(BookingStatus.PENDING, testBooking.getStatus());
        assertEquals(PaymentStatus.FAILED, testPayment.getStatus());
        verify(paymentRepository).save(testPayment);
        verify(bookingRepository, never()).save(testBooking);
    }

    @Test
    void testVerifyPaymentSucceedsWithValidHmacSha256Signature() throws Exception {
        ReflectionTestUtils.setField(paymentService, "razorpayKeySecret", TEST_SECRET);

        when(bookingRepository.findById(10L)).thenReturn(Optional.of(testBooking));
        when(paymentRepository.findByBookingId(10L)).thenReturn(Optional.of(testPayment));
        when(paymentRepository.save(any(Payment.class))).thenReturn(testPayment);
        when(bookingRepository.save(any(Booking.class))).thenReturn(testBooking);

        String orderId = "order_test_123";
        String paymentId = "pay_test_456";
        String payload = orderId + "|" + paymentId;
        String validSignature = calculateExpectedSignature(payload, TEST_SECRET);

        PaymentVerifyRequest request = new PaymentVerifyRequest();
        request.setBookingId(10L);
        request.setRazorpayOrderId(orderId);
        request.setRazorpayPaymentId(paymentId);
        request.setRazorpaySignature(validSignature);
        request.setPaymentMethod("UPI");

        PaymentDTO result = paymentService.verifyPayment(request, "john@example.com", false);

        assertNotNull(result);
        assertEquals(PaymentStatus.SUCCESS, testPayment.getStatus());
        assertEquals(BookingStatus.CONFIRMED, testBooking.getStatus());
        assertEquals(paymentId, testPayment.getRazorpayPaymentId());
        assertEquals(validSignature, testPayment.getRazorpaySignature());
        verify(bookingRepository).save(testBooking);
        verify(paymentRepository).save(testPayment);
    }

    private String calculateExpectedSignature(String data, String key) throws Exception {
        SecretKeySpec signingKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(signingKey);
        byte[] rawHmac = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
        StringBuilder hexString = new StringBuilder();
        for (byte b : rawHmac) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) hexString.append('0');
            hexString.append(hex);
        }
        return hexString.toString();
    }
}
