package com.travelgo.service;

import com.travelgo.dto.BookingDTO;
import com.travelgo.dto.BookingRequest;
import com.travelgo.entity.*;
import com.travelgo.exception.BadRequestException;
import com.travelgo.exception.ResourceNotFoundException;
import com.travelgo.repository.BookingRepository;
import com.travelgo.repository.TourPackageRepository;
import com.travelgo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private TourPackageRepository tourPackageRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public BookingDTO createBooking(BookingRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        TourPackage tourPackage = tourPackageRepository.findById(request.getPackageId())
                .orElseThrow(() -> new ResourceNotFoundException("Package not found with id: " + request.getPackageId()));

        if (tourPackage.getStatus() != PackageStatus.ACTIVE) {
            throw new BadRequestException("This tour package is currently inactive and cannot be booked.");
        }

        if (request.getTravelDate().isBefore(LocalDate.now())) {
            throw new BadRequestException("Travel date cannot be in the past.");
        }

        if (request.getTravellers() < 1) {
            throw new BadRequestException("Number of travellers must be at least 1.");
        }

        if (request.getTravellers() > tourPackage.getMaxTravellers()) {
            throw new BadRequestException("Travellers exceed maximum capacity of " + tourPackage.getMaxTravellers() + " for this package.");
        }

        // STRICT SERVER-SIDE CALCULATION - Never trust frontend price
        BigDecimal pricePerPerson = tourPackage.getPricePerPerson();
        BigDecimal subtotal = pricePerPerson.multiply(BigDecimal.valueOf(request.getTravellers()));
        // Standard 5% GST tax
        BigDecimal taxAmount = subtotal.multiply(new BigDecimal("0.05")).setScale(2, RoundingMode.HALF_UP);
        BigDecimal totalAmount = subtotal.add(taxAmount);

        // Unique booking reference: TGK-YYYY-MMDD-XXXX
        String bookingReference = generateBookingReference(request.getTravelDate());

        Booking booking = new Booking();
        booking.setBookingReference(bookingReference);
        booking.setUser(user);
        booking.setTourPackage(tourPackage);
        booking.setTravelDate(request.getTravelDate());
        booking.setTravellers(request.getTravellers());
        booking.setContactName(request.getContactName());
        booking.setContactEmail(request.getContactEmail());
        booking.setContactPhone(request.getContactPhone());
        booking.setSpecialRequests(request.getSpecialRequests());
        booking.setPricePerPerson(pricePerPerson);
        booking.setSubtotal(subtotal);
        booking.setTaxAmount(taxAmount);
        booking.setTotalAmount(totalAmount);
        booking.setStatus(BookingStatus.PENDING);

        Booking savedBooking = bookingRepository.save(booking);
        return new BookingDTO(savedBooking);
    }

    public List<BookingDTO> getUserBookings(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return bookingRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream().map(BookingDTO::new).collect(Collectors.toList());
    }

    public BookingDTO getBookingById(Long id, String userEmail, boolean isAdmin) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));

        if (!isAdmin && !booking.getUser().getEmail().equalsIgnoreCase(userEmail)) {
            throw new BadRequestException("You are not authorized to view this booking.");
        }

        return new BookingDTO(booking);
    }

    public BookingDTO getBookingByReference(String reference, String userEmail, boolean isAdmin) {
        Booking booking = bookingRepository.findByBookingReference(reference)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with reference: " + reference));

        if (!isAdmin && !booking.getUser().getEmail().equalsIgnoreCase(userEmail)) {
            throw new BadRequestException("You are not authorized to view this booking.");
        }

        return new BookingDTO(booking);
    }

    @Transactional
    public BookingDTO cancelBooking(Long id, String userEmail, boolean isAdmin) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));

        if (!isAdmin && !booking.getUser().getEmail().equalsIgnoreCase(userEmail)) {
            throw new BadRequestException("You are not authorized to cancel this booking.");
        }

        if (booking.getStatus() == BookingStatus.COMPLETED) {
            throw new BadRequestException("Completed bookings cannot be cancelled.");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        Booking updated = bookingRepository.save(booking);
        return new BookingDTO(updated);
    }

    private String generateBookingReference(LocalDate travelDate) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MMdd");
        String datePart = travelDate.format(formatter);
        int randomCode = 1000 + new Random().nextInt(9000);
        return "TGK-" + datePart + "-" + randomCode;
    }
}
