package com.travelgo.dto;

import com.travelgo.entity.Booking;
import com.travelgo.entity.BookingStatus;
import com.travelgo.entity.PaymentStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class BookingDTO {

    private Long id;
    private String bookingReference;
    private Long userId;
    private String userName;
    private String userEmail;
    private Long packageId;
    private String packageName;
    private String packageImage;
    private String destinationName;
    private Integer durationDays;
    private Integer durationNights;
    private LocalDate travelDate;
    private Integer travellers;
    private String contactName;
    private String contactEmail;
    private String contactPhone;
    private String specialRequests;
    private BigDecimal pricePerPerson;
    private BigDecimal subtotal;
    private BigDecimal taxAmount;
    private BigDecimal totalAmount;
    private BookingStatus status;
    private PaymentStatus paymentStatus;
    private String paymentMethod;
    private LocalDateTime createdAt;

    public BookingDTO() {}

    public BookingDTO(Booking b) {
        this.id = b.getId();
        this.bookingReference = b.getBookingReference();
        if (b.getUser() != null) {
            this.userId = b.getUser().getId();
            this.userName = b.getUser().getFullName();
            this.userEmail = b.getUser().getEmail();
        }
        if (b.getTourPackage() != null) {
            this.packageId = b.getTourPackage().getId();
            this.packageName = b.getTourPackage().getName();
            this.packageImage = b.getTourPackage().getMainImageUrl();
            this.durationDays = b.getTourPackage().getDurationDays();
            this.durationNights = b.getTourPackage().getDurationNights();
            if (b.getTourPackage().getDestination() != null) {
                this.destinationName = b.getTourPackage().getDestination().getName();
            }
        }
        this.travelDate = b.getTravelDate();
        this.travellers = b.getTravellers();
        this.contactName = b.getContactName();
        this.contactEmail = b.getContactEmail();
        this.contactPhone = b.getContactPhone();
        this.specialRequests = b.getSpecialRequests();
        this.pricePerPerson = b.getPricePerPerson();
        this.subtotal = b.getSubtotal();
        this.taxAmount = b.getTaxAmount();
        this.totalAmount = b.getTotalAmount();
        this.status = b.getStatus();
        if (b.getPayment() != null) {
            this.paymentStatus = b.getPayment().getStatus();
            this.paymentMethod = b.getPayment().getPaymentMethod();
        }
        this.createdAt = b.getCreatedAt();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getBookingReference() {
        return bookingReference;
    }

    public void setBookingReference(String bookingReference) {
        this.bookingReference = bookingReference;
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

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
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

    public BigDecimal getPricePerPerson() {
        return pricePerPerson;
    }

    public void setPricePerPerson(BigDecimal pricePerPerson) {
        this.pricePerPerson = pricePerPerson;
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }

    public BigDecimal getTaxAmount() {
        return taxAmount;
    }

    public void setTaxAmount(BigDecimal taxAmount) {
        this.taxAmount = taxAmount;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public BookingStatus getStatus() {
        return status;
    }

    public void setStatus(BookingStatus status) {
        this.status = status;
    }

    public PaymentStatus getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(PaymentStatus paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
