package com.travelgo.dto;

import jakarta.validation.constraints.NotNull;

public class RazorpayOrderRequest {

    @NotNull(message = "Booking ID is required")
    private Long bookingId;

    public RazorpayOrderRequest() {}

    public RazorpayOrderRequest(Long bookingId) {
        this.bookingId = bookingId;
    }

    public Long getBookingId() {
        return bookingId;
    }

    public void setBookingId(Long bookingId) {
        this.bookingId = bookingId;
    }
}
