package com.travelgo.dto;

import com.travelgo.entity.Destination;
import com.travelgo.entity.DestinationStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class DestinationDTO {

    private Long id;
    private String name;
    private String state;
    private String country;
    private String description;
    private String imageUrl;
    private String category;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private DestinationStatus status;
    private LocalDateTime createdAt;

    public DestinationDTO() {}

    public DestinationDTO(Destination d) {
        this.id = d.getId();
        this.name = d.getName();
        this.state = d.getState();
        this.country = d.getCountry();
        this.description = d.getDescription();
        this.imageUrl = d.getImageUrl();
        this.category = d.getCategory();
        this.latitude = d.getLatitude();
        this.longitude = d.getLongitude();
        this.status = d.getStatus();
        this.createdAt = d.getCreatedAt();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public BigDecimal getLatitude() {
        return latitude;
    }

    public void setLatitude(BigDecimal latitude) {
        this.latitude = latitude;
    }

    public BigDecimal getLongitude() {
        return longitude;
    }

    public void setLongitude(BigDecimal longitude) {
        this.longitude = longitude;
    }

    public DestinationStatus getStatus() {
        return status;
    }

    public void setStatus(DestinationStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
