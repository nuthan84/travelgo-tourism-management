package com.travelgo.dto;

import com.travelgo.entity.Review;
import com.travelgo.entity.ReviewStatus;

import java.time.LocalDateTime;

public class ReviewDTO {

    private Long id;
    private Long userId;
    private String userName;
    private Long packageId;
    private String packageName;
    private Integer rating;
    private String comment;
    private ReviewStatus status;
    private LocalDateTime createdAt;

    public ReviewDTO() {}

    public ReviewDTO(Review r) {
        this.id = r.getId();
        if (r.getUser() != null) {
            this.userId = r.getUser().getId();
            this.userName = r.getUser().getFullName();
        }
        if (r.getTourPackage() != null) {
            this.packageId = r.getTourPackage().getId();
            this.packageName = r.getTourPackage().getName();
        }
        this.rating = r.getRating();
        this.comment = r.getComment();
        this.status = r.getStatus();
        this.createdAt = r.getCreatedAt();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public Long getPackageId() {
        return packageId;
    }

    public void setPackageId(Long packageId) {
        this.packageId = packageId;
    }

    public String getPackageName() {
        return packageName;
    }

    public void setPackageName(String packageName) {
        this.packageName = packageName;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public ReviewStatus getStatus() {
        return status;
    }

    public void setStatus(ReviewStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
