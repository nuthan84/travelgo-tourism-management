package com.travelgo.dto;

import com.travelgo.entity.PackageImage;
import com.travelgo.entity.PackageStatus;
import com.travelgo.entity.TourPackage;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class PackageDTO {

    private Long id;
    private Long destinationId;
    private String destinationName;
    private String destinationState;
    private String destinationCountry;
    private String name;
    private String description;
    private Integer durationDays;
    private Integer durationNights;
    private BigDecimal pricePerPerson;
    private Integer maxTravellers;
    private String category;
    private String mainImageUrl;
    private String includedServices;
    private String excludedServices;
    private String itinerary;
    private String cancellationPolicy;
    private BigDecimal rating;
    private PackageStatus status;
    private List<String> images = new ArrayList<>();
    private LocalDateTime createdAt;

    public PackageDTO() {}

    public PackageDTO(TourPackage p) {
        this.id = p.getId();
        if (p.getDestination() != null) {
            this.destinationId = p.getDestination().getId();
            this.destinationName = p.getDestination().getName();
            this.destinationState = p.getDestination().getState();
            this.destinationCountry = p.getDestination().getCountry();
        }
        this.name = p.getName();
        this.description = p.getDescription();
        this.durationDays = p.getDurationDays();
        this.durationNights = p.getDurationNights();
        this.pricePerPerson = p.getPricePerPerson();
        this.maxTravellers = p.getMaxTravellers();
        this.category = p.getCategory();
        this.mainImageUrl = p.getMainImageUrl();
        this.includedServices = p.getIncludedServices();
        this.excludedServices = p.getExcludedServices();
        this.itinerary = p.getItinerary();
        this.cancellationPolicy = p.getCancellationPolicy();
        this.rating = p.getRating();
        this.status = p.getStatus();
        if (p.getImages() != null) {
            this.images = p.getImages().stream().map(PackageImage::getImageUrl).collect(Collectors.toList());
        }
        this.createdAt = p.getCreatedAt();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getDestinationId() {
        return destinationId;
    }

    public void setDestinationId(Long destinationId) {
        this.destinationId = destinationId;
    }

    public String getDestinationName() {
        return destinationName;
    }

    public void setDestinationName(String destinationName) {
        this.destinationName = destinationName;
    }

    public String getDestinationState() {
        return destinationState;
    }

    public void setDestinationState(String destinationState) {
        this.destinationState = destinationState;
    }

    public String getDestinationCountry() {
        return destinationCountry;
    }

    public void setDestinationCountry(String destinationCountry) {
        this.destinationCountry = destinationCountry;
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

    public BigDecimal getRating() {
        return rating;
    }

    public void setRating(BigDecimal rating) {
        this.rating = rating;
    }

    public PackageStatus getStatus() {
        return status;
    }

    public void setStatus(PackageStatus status) {
        this.status = status;
    }

    public List<String> getImages() {
        return images;
    }

    public void setImages(List<String> images) {
        this.images = images;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
