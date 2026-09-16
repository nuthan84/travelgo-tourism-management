package com.travelgo.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public class BookingRequest {

    @NotNull(message = "Package ID is required")
    private Long packageId;

    @NotNull(message = "Travel date is required")
    @FutureOrPresent(message = "Travel date cannot be in the past")
    private LocalDate travelDate;

    @NotNull(message = "Number of travellers is required")
    @Min(value = 1, message = "At least 1 traveller is required")
    private Integer travellers;

    @NotBlank(message = "Contact name is required")
    private String contactName;

    @NotBlank(message = "Contact email is required")
    @Email(message = "Invalid contact email")
    private String contactEmail;

    @NotBlank(message = "Contact phone is required")
    private String contactPhone;

    private String specialRequests;

    public BookingRequest() {}

    public Long getPackageId() {
        return packageId;
    }

    public void setPackageId(Long packageId) {
        this.packageId = packageId;
    }

    public LocalDate getTravelDate() {
        return travelDate;
    }

    public void setTravelDate(LocalDate travelDate) {
        this.travelDate = travelDate;
    }

    public Integer getTravellers() {
        return travellers;
    }

    public void setTravellers(Integer travellers) {
        this.travellers = travellers;
    }

    public String getContactName() {
        return contactName;
    }

    public void setContactName(String contactName) {
        this.contactName = contactName;
    }

    public String getContactEmail() {
        return contactEmail;
    }

    public void setContactEmail(String contactEmail) {
        this.contactEmail = contactEmail;
    }

    public String getContactPhone() {
        return contactPhone;
    }

    public void setContactPhone(String contactPhone) {
        this.contactPhone = contactPhone;
    }

    public String getSpecialRequests() {
        return specialRequests;
    }

    public void setSpecialRequests(String specialRequests) {
        this.specialRequests = specialRequests;
    }
}
