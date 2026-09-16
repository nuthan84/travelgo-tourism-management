package com.travelgo.repository;

import com.travelgo.entity.Review;
import com.travelgo.entity.ReviewStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByTourPackageIdAndStatusOrderByCreatedAtDesc(Long packageId, ReviewStatus status);
    List<Review> findByStatusOrderByCreatedAtDesc(ReviewStatus status);
    List<Review> findAllByOrderByCreatedAtDesc();
    long countByStatus(ReviewStatus status);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.tourPackage.id = :packageId AND r.status = 'APPROVED'")
    Double findAverageRatingByPackageId(@Param("packageId") Long packageId);
}
