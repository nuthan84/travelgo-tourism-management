package com.travelgo.controller;

import com.travelgo.dto.PaymentDTO;
import com.travelgo.dto.PaymentVerifyRequest;
import com.travelgo.dto.RazorpayOrderRequest;
import com.travelgo.dto.RazorpayOrderResponse;
import com.travelgo.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/create-order")
    public ResponseEntity<RazorpayOrderResponse> createOrder(
            @Valid @RequestBody RazorpayOrderRequest request, Authentication authentication) {
        boolean isAdmin = authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"));
        RazorpayOrderResponse response = paymentService.createOrder(
                request.getBookingId(), authentication.getName(), isAdmin);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify")
    public ResponseEntity<PaymentDTO> verifyPayment(
            @Valid @RequestBody PaymentVerifyRequest request, Authentication authentication) {
        boolean isAdmin = authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"));
        PaymentDTO payment = paymentService.verifyPayment(
                request, authentication.getName(), isAdmin);
        return ResponseEntity.ok(payment);
    }

    @GetMapping("/{bookingId}")
    public ResponseEntity<PaymentDTO> getPaymentByBookingId(
            @PathVariable Long bookingId, Authentication authentication) {
        boolean isAdmin = authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"));
        PaymentDTO payment = paymentService.getPaymentByBookingId(
                bookingId, authentication.getName(), isAdmin);
        return ResponseEntity.ok(payment);
    }
}
