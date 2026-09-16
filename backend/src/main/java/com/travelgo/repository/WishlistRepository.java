package com.travelgo.repository;

import com.travelgo.entity.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
    List<Wishlist> findByUserIdOrderByCreatedAtDesc(Long userId);
    Optional<Wishlist> findByUserIdAndTourPackageId(Long userId, Long packageId);
    boolean existsByUserIdAndTourPackageId(Long userId, Long packageId);
    void deleteByUserIdAndTourPackageId(Long userId, Long packageId);
    long countByUserId(Long userId);
}
