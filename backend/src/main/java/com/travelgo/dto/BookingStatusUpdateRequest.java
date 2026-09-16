package com.travelgo.dto;

import com.travelgo.entity.BookingStatus;
import jakarta.validation.constraints.NotNull;

public class BookingStatusUpdateRequest {

    @NotNull(message = "Booking status is required")
    private BookingStatus status;

    public BookingStatusUpdateRequest() {}

    public BookingStatusUpdateRequest(BookingStatus status) {
        this.status = status;
    }

    public BookingStatus getStatus() {
        return status;
    }

    public void setStatus(BookingStatus status) {
        this.status = status;
    }
}
