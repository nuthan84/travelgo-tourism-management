package com.travelgo.repository;

import com.travelgo.entity.PackageStatus;
import com.travelgo.entity.TourPackage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface TourPackageRepository extends JpaRepository<TourPackage, Long> {

    List<TourPackage> findByStatus(PackageStatus status);

    List<TourPackage> findByDestinationIdAndStatus(Long destinationId, PackageStatus status);

    @Query("SELECT p FROM TourPackage p WHERE p.status = 'ACTIVE' " +
           "AND (:destinationId IS NULL OR p.destination.id = :destinationId) " +
           "AND (:category IS NULL OR LOWER(p.category) = LOWER(:category)) " +
           "AND (:minPrice IS NULL OR p.pricePerPerson >= :minPrice) " +
           "AND (:maxPrice IS NULL OR p.pricePerPerson <= :maxPrice) " +
           "AND (:durationDays IS NULL OR p.durationDays = :durationDays) " +
           "AND (:search IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "    OR LOWER(p.destination.name) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "    OR LOWER(p.destination.state) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<TourPackage> filterPackages(
            @Param("destinationId") Long destinationId,
            @Param("category") String category,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("durationDays") Integer durationDays,
            @Param("search") String search
    );

    long countByStatus(PackageStatus status);
}
