package com.travelgo.controller;

import com.travelgo.dto.PackageDTO;
import com.travelgo.dto.PackageRequest;
import com.travelgo.service.PackageService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/packages")
public class PackageController {

    @Autowired
    private PackageService packageService;

    @GetMapping
    public ResponseEntity<List<PackageDTO>> getPackages(
            @RequestParam(required = false) Long destinationId,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Integer duration,
            @RequestParam(required = false) String search) {

        List<PackageDTO> packages = packageService.getPackages(
                destinationId, category, minPrice, maxPrice, duration, search);
        return ResponseEntity.ok(packages);
    }

    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<PackageDTO>> getAllPackagesForAdmin() {
        List<PackageDTO> packages = packageService.getAllPackagesForAdmin();
        return ResponseEntity.ok(packages);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PackageDTO> getPackageById(@PathVariable Long id) {
        PackageDTO pkg = packageService.getPackageById(id);
        return ResponseEntity.ok(pkg);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PackageDTO> createPackage(@Valid @RequestBody PackageRequest request) {
        PackageDTO created = packageService.createPackage(request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PackageDTO> updatePackage(
            @PathVariable Long id, @Valid @RequestBody PackageRequest request) {
        PackageDTO updated = packageService.updatePackage(id, request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deletePackage(@PathVariable Long id) {
        packageService.deletePackage(id);
        return ResponseEntity.ok(Map.of("message", "Package deleted or deactivated successfully"));
    }
}
