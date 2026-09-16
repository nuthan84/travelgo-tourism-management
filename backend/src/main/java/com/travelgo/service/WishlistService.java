package com.travelgo.service;

import com.travelgo.dto.WishlistDTO;
import com.travelgo.entity.TourPackage;
import com.travelgo.entity.User;
import com.travelgo.entity.Wishlist;
import com.travelgo.exception.BadRequestException;
import com.travelgo.exception.ResourceNotFoundException;
import com.travelgo.repository.TourPackageRepository;
import com.travelgo.repository.UserRepository;
import com.travelgo.repository.WishlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class WishlistService {

    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TourPackageRepository tourPackageRepository;

    public List<WishlistDTO> getUserWishlist(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return wishlistRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream().map(WishlistDTO::new).collect(Collectors.toList());
    }

    @Transactional
    public WishlistDTO addToWishlist(Long packageId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        TourPackage tourPackage = tourPackageRepository.findById(packageId)
                .orElseThrow(() -> new ResourceNotFoundException("Package not found with id: " + packageId));

        if (wishlistRepository.existsByUserIdAndTourPackageId(user.getId(), packageId)) {
            throw new BadRequestException("Package is already in your wishlist.");
        }

        Wishlist wishlist = new Wishlist(user, tourPackage);
        Wishlist saved = wishlistRepository.save(wishlist);
        return new WishlistDTO(saved);
    }

    @Transactional
    public void removeFromWishlist(Long packageId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        wishlistRepository.deleteByUserIdAndTourPackageId(user.getId(), packageId);
    }
}
