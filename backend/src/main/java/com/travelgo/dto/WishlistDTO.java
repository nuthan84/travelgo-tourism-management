package com.travelgo.dto;

import com.travelgo.entity.Wishlist;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class WishlistDTO {

    private Long id;
    private Long packageId;
    private String packageName;
    private String packageImage;
    private String destinationName;
    private Integer durationDays;
    private Integer durationNights;
    private BigDecimal pricePerPerson;
    private BigDecimal rating;
    private LocalDateTime createdAt;

    public WishlistDTO() {}

    public WishlistDTO(Wishlist w) {
        this.id = w.getId();
        if (w.getTourPackage() != null) {
            this.packageId = w.getTourPackage().getId();
            this.packageName = w.getTourPackage().getName();
            this.packageImage = w.getTourPackage().getMainImageUrl();
            this.durationDays = w.getTourPackage().getDurationDays();
            this.durationNights = w.getTourPackage().getDurationNights();
            this.pricePerPerson = w.getTourPackage().getPricePerPerson();
            this.rating = w.getTourPackage().getRating();
            if (w.getTourPackage().getDestination() != null) {
                this.destinationName = w.getTourPackage().getDestination().getName();
            }
        }
        this.createdAt = w.getCreatedAt();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getPackageImage() {
        return packageImage;
    }

    public void setPackageImage(String packageImage) {
        this.packageImage = packageImage;
    }

    public String getDestinationName() {
        return destinationName;
    }

    public void setDestinationName(String destinationName) {
        this.destinationName = destinationName;
    }

    public Integer getDurationDays() {
        return durationDays;
    }

    public void setDurationDays(Integer durationDays) {
        this.durationDays = durationDays;
    }

    public Integer getDurationNights() {
        return durationNights;
    }

    public void setDurationNights(Integer durationNights) {
        this.durationNights = durationNights;
    }

    public BigDecimal getPricePerPerson() {
        return pricePerPerson;
    }

    public void setPricePerPerson(BigDecimal pricePerPerson) {
        this.pricePerPerson = pricePerPerson;
    }

    public BigDecimal getRating() {
        return rating;
    }

    public void setRating(BigDecimal rating) {
        this.rating = rating;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
