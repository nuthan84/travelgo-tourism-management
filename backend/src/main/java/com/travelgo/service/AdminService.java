package com.travelgo.service;

import com.travelgo.dto.AdminDashboardDTO;
import com.travelgo.dto.BookingDTO;
import com.travelgo.dto.PaymentDTO;
import com.travelgo.dto.UserDTO;
import com.travelgo.entity.*;
import com.travelgo.exception.ResourceNotFoundException;
import com.travelgo.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TourPackageRepository tourPackageRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private DestinationRepository destinationRepository;

    public AdminDashboardDTO getDashboardStats() {
        AdminDashboardDTO dto = new AdminDashboardDTO();

        dto.setTotalUsers(userRepository.count());
        dto.setTotalPackages(tourPackageRepository.count());
        dto.setTotalBookings(bookingRepository.count());

        BigDecimal revenue = bookingRepository.calculateTotalRevenue();
        dto.setTotalRevenue(revenue != null ? revenue : BigDecimal.ZERO);

        dto.setPendingReviews(reviewRepository.countByStatus(ReviewStatus.PENDING));

        // Recent bookings
        List<BookingDTO> recent = bookingRepository.findTop5ByOrderByCreatedAtDesc()
                .stream().map(BookingDTO::new).collect(Collectors.toList());
        dto.setRecentBookings(recent);

        // Popular destinations aggregation
        List<Destination> destinations = destinationRepository.findAll();
        List<Map<String, Object>> popularDestinations = new ArrayList<>();
        for (Destination d : destinations) {
            Map<String, Object> map = new HashMap<>();
            map.put("name", d.getName());
            map.put("image", d.getImageUrl());
            // Count bookings for this destination
            long bookingCount = bookingRepository.findAll().stream()
                    .filter(b -> b.getTourPackage() != null && b.getTourPackage().getDestination() != null &&
                            b.getTourPackage().getDestination().getId().equals(d.getId()))
                    .count();
            map.put("bookings", bookingCount);
            popularDestinations.add(map);
        }
        popularDestinations.sort((a, b) -> Long.compare((Long) b.get("bookings"), (Long) a.get("bookings")));
        dto.setPopularDestinations(popularDestinations.stream().limit(5).collect(Collectors.toList()));

        // Sample monthly statistics for charts
        List<Map<String, Object>> bookingStats = List.of(
                Map.of("month", "Jan", "count", 45),
                Map.of("month", "Feb", "count", 62),
                Map.of("month", "Mar", "count", 89),
                Map.of("month", "Apr", "count", 110),
                Map.of("month", "May", "count", 145),
                Map.of("month", "Jun", "count", 180)
        );
        dto.setBookingStatistics(bookingStats);

        List<Map<String, Object>> revenueStats = List.of(
                Map.of("month", "Jan", "amount", 125000),
                Map.of("month", "Feb", "amount", 195000),
                Map.of("month", "Mar", "amount", 310000),
                Map.of("month", "Apr", "amount", 440000),
                Map.of("month", "May", "amount", 680000),
                Map.of("month", "Jun", "amount", 950000)
        );
        dto.setRevenueStatistics(revenueStats);

        return dto;
    }

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream().map(UserDTO::new).collect(Collectors.toList());
    }

    @Transactional
    public UserDTO updateUserStatus(Long userId, UserStatus status) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        user.setStatus(status);
        return new UserDTO(userRepository.save(user));
    }

    public List<BookingDTO> getAllBookings() {
        return bookingRepository.findAllByOrderByCreatedAtDesc()
                .stream().map(BookingDTO::new).collect(Collectors.toList());
    }

    @Transactional
    public BookingDTO updateBookingStatus(Long bookingId, BookingStatus status) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));
        booking.setStatus(status);
        return new BookingDTO(bookingRepository.save(booking));
    }

    public List<PaymentDTO> getAllPayments() {
        return paymentRepository.findAllByOrderByCreatedAtDesc()
                .stream().map(PaymentDTO::new).collect(Collectors.toList());
    }
}
