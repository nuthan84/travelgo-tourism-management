package com.travelgo.controller;

import com.travelgo.dto.*;
import com.travelgo.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashboardDTO> getDashboardStats() {
        AdminDashboardDTO stats = adminService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<UserDTO> users = adminService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @PutMapping("/users/{id}/status")
    public ResponseEntity<UserDTO> updateUserStatus(
            @PathVariable Long id, @Valid @RequestBody UserStatusUpdateRequest request) {
        UserDTO updated = adminService.updateUserStatus(id, request.getStatus());
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/bookings")
    public ResponseEntity<List<BookingDTO>> getAllBookings() {
        List<BookingDTO> bookings = adminService.getAllBookings();
        return ResponseEntity.ok(bookings);
    }

    @PutMapping("/bookings/{id}/status")
    public ResponseEntity<BookingDTO> updateBookingStatus(
            @PathVariable Long id, @Valid @RequestBody BookingStatusUpdateRequest request) {
        BookingDTO updated = adminService.updateBookingStatus(id, request.getStatus());
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/payments")
    public ResponseEntity<List<PaymentDTO>> getAllPayments() {
        List<PaymentDTO> payments = adminService.getAllPayments();
        return ResponseEntity.ok(payments);
    }
}
