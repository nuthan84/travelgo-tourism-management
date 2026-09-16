package com.travelgo.dto;

import java.math.BigDecimal;

public class RazorpayOrderResponse {

    private String orderId;
    private BigDecimal amount;
    private String currency;
    private String keyId;
    private Long bookingId;
    private String bookingReference;

    public RazorpayOrderResponse() {}

    public RazorpayOrderResponse(String orderId, BigDecimal amount, String currency, String keyId, Long bookingId, String bookingReference) {
        this.orderId = orderId;
        this.amount = amount;
        this.currency = currency;
        this.keyId = keyId;
        this.bookingId = bookingId;
        this.bookingReference = bookingReference;
    }

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getKeyId() {
        return keyId;
    }

    public void setKeyId(String keyId) {
        this.keyId = keyId;
    }

    public Long getBookingId() {
        return bookingId;
    }

    public void setBookingId(Long bookingId) {
        this.bookingId = bookingId;
    }

    public String getBookingReference() {
        return bookingReference;
    }

    public void setBookingReference(String bookingReference) {
        this.bookingReference = bookingReference;
    }
}
