package com.travelgo.controller;

import com.travelgo.dto.DestinationDTO;
import com.travelgo.dto.DestinationRequest;
import com.travelgo.service.DestinationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/destinations")
public class DestinationController {

    @Autowired
    private DestinationService destinationService;

    @GetMapping
    public ResponseEntity<List<DestinationDTO>> getAllDestinations(
            @RequestParam(required = false, defaultValue = "false") Boolean activeOnly) {
        List<DestinationDTO> destinations = destinationService.getAllDestinations(activeOnly);
        return ResponseEntity.ok(destinations);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DestinationDTO> getDestinationById(@PathVariable Long id) {
        DestinationDTO destination = destinationService.getDestinationById(id);
        return ResponseEntity.ok(destination);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DestinationDTO> createDestination(@Valid @RequestBody DestinationRequest request) {
        DestinationDTO created = destinationService.createDestination(request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DestinationDTO> updateDestination(
            @PathVariable Long id, @Valid @RequestBody DestinationRequest request) {
        DestinationDTO updated = destinationService.updateDestination(id, request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deleteDestination(@PathVariable Long id) {
        destinationService.deleteDestination(id);
        return ResponseEntity.ok(Map.of("message", "Destination deleted or deactivated successfully"));
    }
}
