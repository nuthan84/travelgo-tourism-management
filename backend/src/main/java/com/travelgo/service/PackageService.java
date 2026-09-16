package com.travelgo.service;

import com.travelgo.dto.PackageDTO;
import com.travelgo.dto.PackageRequest;
import com.travelgo.entity.Destination;
import com.travelgo.entity.PackageImage;
import com.travelgo.entity.PackageStatus;
import com.travelgo.entity.TourPackage;
import com.travelgo.exception.ResourceNotFoundException;
import com.travelgo.repository.DestinationRepository;
import com.travelgo.repository.PackageImageRepository;
import com.travelgo.repository.TourPackageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PackageService {

    @Autowired
    private TourPackageRepository tourPackageRepository;

    @Autowired
    private DestinationRepository destinationRepository;

    @Autowired
    private PackageImageRepository packageImageRepository;

    public List<PackageDTO> getPackages(Long destinationId, String category, BigDecimal minPrice,
                                        BigDecimal maxPrice, Integer durationDays, String search) {
        List<TourPackage> packages = tourPackageRepository.filterPackages(
                destinationId,
                category,
                minPrice,
                maxPrice,
                durationDays,
                search
        );
        return packages.stream().map(PackageDTO::new).collect(Collectors.toList());
    }

    public List<PackageDTO> getAllPackagesForAdmin() {
        return tourPackageRepository.findAll().stream().map(PackageDTO::new).collect(Collectors.toList());
    }

    public PackageDTO getPackageById(Long id) {
        TourPackage tourPackage = tourPackageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Package not found with id: " + id));
        return new PackageDTO(tourPackage);
    }

    @Transactional
    public PackageDTO createPackage(PackageRequest request) {
        Destination destination = destinationRepository.findById(request.getDestinationId())
                .orElseThrow(() -> new ResourceNotFoundException("Destination not found with id: " + request.getDestinationId()));

        TourPackage tourPackage = new TourPackage();
        tourPackage.setDestination(destination);
        tourPackage.setName(request.getName());
        tourPackage.setDescription(request.getDescription());
        tourPackage.setDurationDays(request.getDurationDays());
        tourPackage.setDurationNights(request.getDurationNights());
        tourPackage.setPricePerPerson(request.getPricePerPerson());
        tourPackage.setMaxTravellers(request.getMaxTravellers());
        tourPackage.setCategory(request.getCategory());
        tourPackage.setMainImageUrl(request.getMainImageUrl());
        tourPackage.setIncludedServices(request.getIncludedServices());
        tourPackage.setExcludedServices(request.getExcludedServices());
        tourPackage.setItinerary(request.getItinerary());
        tourPackage.setCancellationPolicy(request.getCancellationPolicy());
        tourPackage.setStatus(request.getStatus() != null ? request.getStatus() : PackageStatus.ACTIVE);

        TourPackage savedPackage = tourPackageRepository.save(tourPackage);

        if (request.getGalleryImages() != null && !request.getGalleryImages().isEmpty()) {
            int order = 1;
            for (String imgUrl : request.getGalleryImages()) {
                if (imgUrl != null && !imgUrl.trim().isEmpty()) {
                    PackageImage image = new PackageImage(savedPackage, imgUrl.trim(), order++);
                    packageImageRepository.save(image);
                    savedPackage.getImages().add(image);
                }
            }
        }

        return new PackageDTO(savedPackage);
    }

    @Transactional
    public PackageDTO updatePackage(Long id, PackageRequest request) {
        TourPackage tourPackage = tourPackageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Package not found with id: " + id));

        Destination destination = destinationRepository.findById(request.getDestinationId())
                .orElseThrow(() -> new ResourceNotFoundException("Destination not found with id: " + request.getDestinationId()));

        tourPackage.setDestination(destination);
        tourPackage.setName(request.getName());
        tourPackage.setDescription(request.getDescription());
        tourPackage.setDurationDays(request.getDurationDays());
        tourPackage.setDurationNights(request.getDurationNights());
        tourPackage.setPricePerPerson(request.getPricePerPerson());
        tourPackage.setMaxTravellers(request.getMaxTravellers());
        tourPackage.setCategory(request.getCategory());
        tourPackage.setMainImageUrl(request.getMainImageUrl());
        tourPackage.setIncludedServices(request.getIncludedServices());
        tourPackage.setExcludedServices(request.getExcludedServices());
        tourPackage.setItinerary(request.getItinerary());
        tourPackage.setCancellationPolicy(request.getCancellationPolicy());
        if (request.getStatus() != null) {
            tourPackage.setStatus(request.getStatus());
        }

        if (request.getGalleryImages() != null) {
            packageImageRepository.deleteByTourPackageId(tourPackage.getId());
            tourPackage.getImages().clear();
            int order = 1;
            for (String imgUrl : request.getGalleryImages()) {
                if (imgUrl != null && !imgUrl.trim().isEmpty()) {
                    PackageImage image = new PackageImage(tourPackage, imgUrl.trim(), order++);
                    packageImageRepository.save(image);
                    tourPackage.getImages().add(image);
                }
            }
        }

        TourPackage updated = tourPackageRepository.save(tourPackage);
        return new PackageDTO(updated);
    }

    @Transactional
    public void deletePackage(Long id) {
        TourPackage tourPackage = tourPackageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Package not found with id: " + id));

        try {
            tourPackageRepository.delete(tourPackage);
        } catch (Exception e) {
            // As required by Rule 25: Prefer deactivation over hard deletion when booking history exists
            tourPackage.setStatus(PackageStatus.INACTIVE);
            tourPackageRepository.save(tourPackage);
        }
    }
}
