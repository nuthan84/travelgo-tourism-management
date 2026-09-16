package com.travelgo.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class AdminDashboardDTO {

    private long totalUsers;
    private long totalPackages;
    private long totalBookings;
    private BigDecimal totalRevenue;
    private long pendingReviews;
    private List<BookingDTO> recentBookings;
    private List<Map<String, Object>> popularDestinations;
    private List<Map<String, Object>> bookingStatistics;
    private List<Map<String, Object>> revenueStatistics;

    public AdminDashboardDTO() {}

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalPackages() {
        return totalPackages;
    }

    public void setTotalPackages(long totalPackages) {
        this.totalPackages = totalPackages;
    }

    public long getTotalBookings() {
        return totalBookings;
    }

    public void setTotalBookings(long totalBookings) {
        this.totalBookings = totalBookings;
    }

    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(BigDecimal totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public long getPendingReviews() {
        return pendingReviews;
    }

    public void setPendingReviews(long pendingReviews) {
        this.pendingReviews = pendingReviews;
    }

    public List<BookingDTO> getRecentBookings() {
        return recentBookings;
    }

    public void setRecentBookings(List<BookingDTO> recentBookings) {
        this.recentBookings = recentBookings;
    }

    public List<Map<String, Object>> getPopularDestinations() {
        return popularDestinations;
    }

    public void setPopularDestinations(List<Map<String, Object>> popularDestinations) {
        this.popularDestinations = popularDestinations;
    }

    public List<Map<String, Object>> getBookingStatistics() {
        return bookingStatistics;
    }

    public void setBookingStatistics(List<Map<String, Object>> bookingStatistics) {
        this.bookingStatistics = bookingStatistics;
    }

    public List<Map<String, Object>> getRevenueStatistics() {
        return revenueStatistics;
    }

    public void setRevenueStatistics(List<Map<String, Object>> revenueStatistics) {
        this.revenueStatistics = revenueStatistics;
    }
}
