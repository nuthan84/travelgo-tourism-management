package com.travelgo.dto;

import com.travelgo.entity.ReviewStatus;
import jakarta.validation.constraints.NotNull;

public class ReviewStatusUpdateRequest {

    @NotNull(message = "Review status is required")
    private ReviewStatus status;

    public ReviewStatusUpdateRequest() {}

    public ReviewStatusUpdateRequest(ReviewStatus status) {
        this.status = status;
    }

    public ReviewStatus getStatus() {
        return status;
    }

    public void setStatus(ReviewStatus status) {
        this.status = status;
    }
}
