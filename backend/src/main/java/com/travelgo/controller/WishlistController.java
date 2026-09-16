package com.travelgo.controller;

import com.travelgo.dto.WishlistDTO;
import com.travelgo.service.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;

    @GetMapping
    public ResponseEntity<List<WishlistDTO>> getWishlist(Authentication authentication) {
        List<WishlistDTO> wishlist = wishlistService.getUserWishlist(authentication.getName());
        return ResponseEntity.ok(wishlist);
    }

    @PostMapping("/{packageId}")
    public ResponseEntity<WishlistDTO> addToWishlist(
            @PathVariable Long packageId, Authentication authentication) {
        WishlistDTO dto = wishlistService.addToWishlist(packageId, authentication.getName());
        return new ResponseEntity<>(dto, HttpStatus.CREATED);
    }

    @DeleteMapping("/{packageId}")
    public ResponseEntity<Map<String, String>> removeFromWishlist(
            @PathVariable Long packageId, Authentication authentication) {
        wishlistService.removeFromWishlist(packageId, authentication.getName());
        return ResponseEntity.ok(Map.of("message", "Item removed from wishlist"));
    }
}
