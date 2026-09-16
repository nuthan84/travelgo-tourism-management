package com.travelgo.dto;

import com.travelgo.entity.PackageStatus;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.List;

public class PackageRequest {

    @NotNull(message = "Destination ID is required")
    private Long destinationId;

    @NotBlank(message = "Package name is required")
    private String name;

    private String description;

    @NotNull(message = "Duration in days is required")
    @Min(value = 1, message = "Duration days must be at least 1")
    private Integer durationDays;

    @NotNull(message = "Duration in nights is required")
    @Min(value = 0, message = "Duration nights must be 0 or more")
    private Integer durationNights;

    @NotNull(message = "Price per person is required")
    @Min(value = 0, message = "Price per person must be positive")
    private BigDecimal pricePerPerson;

    @NotNull(message = "Maximum travellers is required")
    @Min(value = 1, message = "Max travellers must be at least 1")
    private Integer maxTravellers;

    private String category;
    private String mainImageUrl;
    private String includedServices;
    private String excludedServices;
    private String itinerary;
    private String cancellationPolicy;
    private PackageStatus status = PackageStatus.ACTIVE;
    private List<String> galleryImages;

    public PackageRequest() {}

    public Long getDestinationId() {
        return destinationId;
    }

    public void setDestinationId(Long destinationId) {
        this.destinationId = destinationId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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

    public Integer getMaxTravellers() {
        return maxTravellers;
    }

    public void setMaxTravellers(Integer maxTravellers) {
        this.maxTravellers = maxTravellers;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getMainImageUrl() {
        return mainImageUrl;
    }

    public void setMainImageUrl(String mainImageUrl) {
        this.mainImageUrl = mainImageUrl;
    }

    public String getIncludedServices() {
        return includedServices;
    }

    public void setIncludedServices(String includedServices) {
        this.includedServices = includedServices;
    }

    public String getExcludedServices() {
        return excludedServices;
    }

    public void setExcludedServices(String excludedServices) {
        this.excludedServices = excludedServices;
    }

    public String getItinerary() {
        return itinerary;
    }

    public void setItinerary(String itinerary) {
        this.itinerary = itinerary;
    }

    public String getCancellationPolicy() {
        return cancellationPolicy;
    }

    public void setCancellationPolicy(String cancellationPolicy) {
        this.cancellationPolicy = cancellationPolicy;
    }

    public PackageStatus getStatus() {
        return status;
    }

    public void setStatus(PackageStatus status) {
        this.status = status;
    }

    public List<String> getGalleryImages() {
        return galleryImages;
    }

    public void setGalleryImages(List<String> galleryImages) {
        this.galleryImages = galleryImages;
    }
}
