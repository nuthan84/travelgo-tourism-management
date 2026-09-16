package com.travelgo.controller;

import com.travelgo.dto.BookingDTO;
import com.travelgo.dto.BookingRequest;
import com.travelgo.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping
    public ResponseEntity<BookingDTO> createBooking(
            @Valid @RequestBody BookingRequest request, Authentication authentication) {
        BookingDTO booking = bookingService.createBooking(request, authentication.getName());
        return new ResponseEntity<>(booking, HttpStatus.CREATED);
    }

    @GetMapping("/my")
    public ResponseEntity<List<BookingDTO>> getMyBookings(Authentication authentication) {
        List<BookingDTO> bookings = bookingService.getUserBookings(authentication.getName());
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookingDTO> getBookingById(
            @PathVariable Long id, Authentication authentication) {
        boolean isAdmin = authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"));
        BookingDTO booking = bookingService.getBookingById(id, authentication.getName(), isAdmin);
        return ResponseEntity.ok(booking);
    }

    @GetMapping("/ref/{reference}")
    public ResponseEntity<BookingDTO> getBookingByReference(
            @PathVariable String reference, Authentication authentication) {
        boolean isAdmin = authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"));
        BookingDTO booking = bookingService.getBookingByReference(reference, authentication.getName(), isAdmin);
        return ResponseEntity.ok(booking);
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<BookingDTO> cancelBooking(
            @PathVariable Long id, Authentication authentication) {
        boolean isAdmin = authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"));
        BookingDTO cancelled = bookingService.cancelBooking(id, authentication.getName(), isAdmin);
        return ResponseEntity.ok(cancelled);
    }
}
