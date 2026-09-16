package com.travelgo.service;

import com.travelgo.dto.ReviewDTO;
import com.travelgo.dto.ReviewRequest;
import com.travelgo.entity.*;
import com.travelgo.exception.BadRequestException;
import com.travelgo.exception.ResourceNotFoundException;
import com.travelgo.repository.ReviewRepository;
import com.travelgo.repository.TourPackageRepository;
import com.travelgo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private TourPackageRepository tourPackageRepository;

    @Autowired
    private UserRepository userRepository;

    public List<ReviewDTO> getApprovedReviewsForPackage(Long packageId) {
        return reviewRepository.findByTourPackageIdAndStatusOrderByCreatedAtDesc(packageId, ReviewStatus.APPROVED)
                .stream().map(ReviewDTO::new).collect(Collectors.toList());
    }

    public List<ReviewDTO> getAllReviewsForAdmin(ReviewStatus status) {
        List<Review> reviews = (status != null)
                ? reviewRepository.findByStatusOrderByCreatedAtDesc(status)
                : reviewRepository.findAllByOrderByCreatedAtDesc();
        return reviews.stream().map(ReviewDTO::new).collect(Collectors.toList());
    }

    @Transactional
    public ReviewDTO createReview(ReviewRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        TourPackage tourPackage = tourPackageRepository.findById(request.getPackageId())
                .orElseThrow(() -> new ResourceNotFoundException("Package not found with id: " + request.getPackageId()));

        Review review = new Review();
        review.setUser(user);
        review.setTourPackage(tourPackage);
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        // Default to PENDING for moderation, or APPROVED if user is admin
        review.setStatus(user.getRole() == Role.ADMIN ? ReviewStatus.APPROVED : ReviewStatus.PENDING);

        Review saved = reviewRepository.save(review);

        if (saved.getStatus() == ReviewStatus.APPROVED) {
            updatePackageAverageRating(tourPackage.getId());
        }

        return new ReviewDTO(saved);
    }

    @Transactional
    public ReviewDTO updateReviewStatus(Long reviewId, ReviewStatus status) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with id: " + reviewId));

        review.setStatus(status);
        Review updated = reviewRepository.save(review);
        updatePackageAverageRating(review.getTourPackage().getId());
        return new ReviewDTO(updated);
    }

    @Transactional
    public void deleteReview(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with id: " + reviewId));

        Long packageId = review.getTourPackage().getId();
        reviewRepository.delete(review);
        updatePackageAverageRating(packageId);
    }

    private void updatePackageAverageRating(Long packageId) {
        Double avg = reviewRepository.findAverageRatingByPackageId(packageId);
        TourPackage tourPackage = tourPackageRepository.findById(packageId).orElse(null);
        if (tourPackage != null) {
            if (avg != null && avg > 0) {
                tourPackage.setRating(BigDecimal.valueOf(avg).setScale(1, RoundingMode.HALF_UP));
            } else {
                tourPackage.setRating(BigDecimal.ZERO);
            }
            tourPackageRepository.save(tourPackage);
        }
    }
}
