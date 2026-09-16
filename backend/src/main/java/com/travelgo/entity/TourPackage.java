package com.travelgo.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tour_packages")
public class TourPackage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "destination_id", nullable = false)
    private Destination destination;

    @Column(name = "name", nullable = false, length = 150)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "duration_days", nullable = false)
    private Integer durationDays;

    @Column(name = "duration_nights", nullable = false)
    private Integer durationNights;

    @Column(name = "price_per_person", nullable = false, precision = 10, scale = 2)
    private BigDecimal pricePerPerson;

    @Column(name = "max_travellers", nullable = false)
    private Integer maxTravellers;

    @Column(name = "category", length = 50)
    private String category;

    @Column(name = "main_image_url", length = 500)
    private String mainImageUrl;

    @Column(name = "included_services", columnDefinition = "TEXT")
    private String includedServices;

    @Column(name = "excluded_services", columnDefinition = "TEXT")
    private String excludedServices;

    @Column(name = "itinerary", columnDefinition = "TEXT")
    private String itinerary;

    @Column(name = "cancellation_policy", columnDefinition = "TEXT")
    private String cancellationPolicy;

    @Column(name = "rating", precision = 2, scale = 1)
    private BigDecimal rating = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private PackageStatus status = PackageStatus.ACTIVE;

    @OneToMany(mappedBy = "tourPackage", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("displayOrder ASC")
    private List<PackageImage> images = new ArrayList<>();

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", insertable = false, updatable = false)
    private LocalDateTime updatedAt;

    public TourPackage() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Destination getDestination() {
        return destination;
    }

    public void setDestination(Destination destination) {
        this.destination = destination;
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

    public List<PackageImage> getImages() {
        return images;
    }

    public void setImages(List<PackageImage> images) {
        this.images = images;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
