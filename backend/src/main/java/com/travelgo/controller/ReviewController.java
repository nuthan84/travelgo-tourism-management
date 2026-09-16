package com.travelgo.controller;

import com.travelgo.dto.ReviewDTO;
import com.travelgo.dto.ReviewRequest;
import com.travelgo.dto.ReviewStatusUpdateRequest;
import com.travelgo.entity.ReviewStatus;
import com.travelgo.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @GetMapping("/package/{packageId}")
    public ResponseEntity<List<ReviewDTO>> getApprovedReviewsForPackage(@PathVariable Long packageId) {
        List<ReviewDTO> reviews = reviewService.getApprovedReviewsForPackage(packageId);
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ReviewDTO>> getAllReviewsForAdmin(
            @RequestParam(required = false) ReviewStatus status) {
        List<ReviewDTO> reviews = reviewService.getAllReviewsForAdmin(status);
        return ResponseEntity.ok(reviews);
    }

    @PostMapping
    public ResponseEntity<ReviewDTO> createReview(
            @Valid @RequestBody ReviewRequest request, Authentication authentication) {
        ReviewDTO review = reviewService.createReview(request, authentication.getName());
        return new ResponseEntity<>(review, HttpStatus.CREATED);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ReviewDTO> updateReviewStatus(
            @PathVariable Long id, @Valid @RequestBody ReviewStatusUpdateRequest request) {
        ReviewDTO updated = reviewService.updateReviewStatus(id, request.getStatus());
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deleteReview(@PathVariable Long id) {
        reviewService.deleteReview(id);
        return ResponseEntity.ok(Map.of("message", "Review deleted successfully"));
    }
}
