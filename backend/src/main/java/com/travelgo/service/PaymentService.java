package com.travelgo.service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.travelgo.dto.PaymentDTO;
import com.travelgo.dto.PaymentVerifyRequest;
import com.travelgo.dto.RazorpayOrderResponse;
import com.travelgo.entity.Booking;
import com.travelgo.entity.BookingStatus;
import com.travelgo.entity.Payment;
import com.travelgo.entity.PaymentStatus;
import com.travelgo.exception.BadRequestException;
import com.travelgo.exception.ResourceNotFoundException;
import com.travelgo.repository.BookingRepository;
import com.travelgo.repository.PaymentRepository;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.security.SignatureException;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class PaymentService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Value("${razorpay.key-id:}")
    private String razorpayKeyId;

    @Value("${razorpay.key-secret:}")
    private String razorpayKeySecret;

    @Transactional
    public RazorpayOrderResponse createOrder(Long bookingId, String userEmail, boolean isAdmin) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        if (!isAdmin && !booking.getUser().getEmail().equalsIgnoreCase(userEmail)) {
            throw new BadRequestException("You are not authorized to pay for this booking.");
        }

        if (booking.getStatus() == BookingStatus.CONFIRMED || booking.getStatus() == BookingStatus.COMPLETED) {
            throw new BadRequestException("This booking has already been paid for.");
        }

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new BadRequestException("Cannot make payment for a cancelled booking.");
        }

        String orderId;
        BigDecimal amount = booking.getTotalAmount();
        long amountInPaise = amount.multiply(new BigDecimal(100)).longValue();

        if (razorpayKeyId != null && !razorpayKeyId.trim().isEmpty() &&
            razorpayKeySecret != null && !razorpayKeySecret.trim().isEmpty()) {
            try {
                RazorpayClient client = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
                JSONObject orderRequest = new JSONObject();
                orderRequest.put("amount", amountInPaise);
                orderRequest.put("currency", "INR");
                orderRequest.put("receipt", booking.getBookingReference());

                Order order = client.orders.create(orderRequest);
                orderId = order.get("id");
            } catch (RazorpayException e) {
                throw new BadRequestException("Failed to initiate Razorpay order: " + e.getMessage());
            }
        } else {
            // Test simulated order ID when live keys are pending
            orderId = "order_sim_" + UUID.randomUUID().toString().substring(0, 14);
        }

        // Create or update payment record
        Optional<Payment> existingPayment = paymentRepository.findByBookingId(booking.getId());
        Payment payment = existingPayment.orElseGet(Payment::new);
        payment.setBooking(booking);
        payment.setRazorpayOrderId(orderId);
        payment.setAmount(amount);
        payment.setCurrency("INR");
        payment.setStatus(PaymentStatus.CREATED);

        paymentRepository.save(payment);

        return new RazorpayOrderResponse(
                orderId,
                amount,
                "INR",
                razorpayKeyId != null && !razorpayKeyId.isEmpty() ? razorpayKeyId : "rzp_test_demo",
                booking.getId(),
                booking.getBookingReference()
        );
    }

    @Transactional
    public PaymentDTO verifyPayment(PaymentVerifyRequest request, String userEmail, boolean isAdmin) {
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + request.getBookingId()));

        if (!isAdmin && !booking.getUser().getEmail().equalsIgnoreCase(userEmail)) {
            throw new BadRequestException("Unauthorized access to booking payment.");
        }

        Payment payment = paymentRepository.findByBookingId(booking.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Payment record not found for booking id: " + request.getBookingId()));

        boolean isSignatureValid = false;

        if (razorpayKeySecret != null && !razorpayKeySecret.trim().isEmpty() && !request.getRazorpayOrderId().startsWith("order_sim_")) {
            try {
                String payload = request.getRazorpayOrderId() + "|" + request.getRazorpayPaymentId();
                String expectedSignature = calculateHmacSha256(payload, razorpayKeySecret);
                isSignatureValid = expectedSignature.equals(request.getRazorpaySignature());
            } catch (Exception e) {
                isSignatureValid = false;
            }
        } else {
            // In demo/test simulated mode, approve if signature is present
            isSignatureValid = request.getRazorpaySignature() != null && !request.getRazorpaySignature().trim().isEmpty();
        }

        if (!isSignatureValid) {
            payment.setStatus(PaymentStatus.FAILED);
            paymentRepository.save(payment);
            throw new BadRequestException("Payment verification failed! Invalid Razorpay signature.");
        }

        // Update Payment status
        payment.setRazorpayPaymentId(request.getRazorpayPaymentId());
        payment.setRazorpaySignature(request.getRazorpaySignature());
        payment.setStatus(PaymentStatus.SUCCESS);
        payment.setPaymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "Razorpay");
        payment.setPaidAt(LocalDateTime.now());
        Payment savedPayment = paymentRepository.save(payment);

        // Transition Booking status to CONFIRMED
        booking.setStatus(BookingStatus.CONFIRMED);
        bookingRepository.save(booking);

        return new PaymentDTO(savedPayment);
    }

    public PaymentDTO getPaymentByBookingId(Long bookingId, String userEmail, boolean isAdmin) {
        Payment payment = paymentRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found for booking id: " + bookingId));

        if (!isAdmin && !payment.getBooking().getUser().getEmail().equalsIgnoreCase(userEmail)) {
            throw new BadRequestException("Unauthorized access to payment information.");
        }

        return new PaymentDTO(payment);
    }

    private String calculateHmacSha256(String data, String key) throws SignatureException {
        try {
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
        } catch (Exception e) {
            throw new SignatureException("Failed to calculate HMAC-SHA256: " + e.getMessage());
        }
    }
}
