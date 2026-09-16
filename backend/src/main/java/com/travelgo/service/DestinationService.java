package com.travelgo.service;

import com.travelgo.dto.DestinationDTO;
import com.travelgo.dto.DestinationRequest;
import com.travelgo.entity.Destination;
import com.travelgo.entity.DestinationStatus;
import com.travelgo.exception.BadRequestException;
import com.travelgo.exception.ResourceNotFoundException;
import com.travelgo.repository.DestinationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DestinationService {

    @Autowired
    private DestinationRepository destinationRepository;

    public List<DestinationDTO> getAllDestinations(Boolean activeOnly) {
        List<Destination> destinations;
        if (Boolean.TRUE.equals(activeOnly)) {
            destinations = destinationRepository.findByStatus(DestinationStatus.ACTIVE);
        } else {
            destinations = destinationRepository.findAll();
        }
        return destinations.stream().map(DestinationDTO::new).collect(Collectors.toList());
    }

    public DestinationDTO getDestinationById(Long id) {
        Destination destination = destinationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Destination not found with id: " + id));
        return new DestinationDTO(destination);
    }

    @Transactional
    public DestinationDTO createDestination(DestinationRequest request) {
        Destination destination = new Destination(
                request.getName(),
                request.getState(),
                request.getCountry() != null ? request.getCountry() : "India",
                request.getDescription(),
                request.getImageUrl(),
                request.getCategory(),
                request.getLatitude(),
                request.getLongitude(),
                request.getStatus() != null ? request.getStatus() : DestinationStatus.ACTIVE
        );
        Destination saved = destinationRepository.save(destination);
        return new DestinationDTO(saved);
    }

    @Transactional
    public DestinationDTO updateDestination(Long id, DestinationRequest request) {
        Destination destination = destinationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Destination not found with id: " + id));

        destination.setName(request.getName());
        destination.setState(request.getState());
        if (request.getCountry() != null) {
            destination.setCountry(request.getCountry());
        }
        destination.setDescription(request.getDescription());
        destination.setImageUrl(request.getImageUrl());
        destination.setCategory(request.getCategory());
        destination.setLatitude(request.getLatitude());
        destination.setLongitude(request.getLongitude());
        if (request.getStatus() != null) {
            destination.setStatus(request.getStatus());
        }

        Destination updated = destinationRepository.save(destination);
        return new DestinationDTO(updated);
    }

    @Transactional
    public void deleteDestination(Long id) {
        Destination destination = destinationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Destination not found with id: " + id));

        try {
            destinationRepository.delete(destination);
        } catch (Exception e) {
            // If foreign key constraint violation, soft deactivate
            destination.setStatus(DestinationStatus.INACTIVE);
            destinationRepository.save(destination);
        }
    }
}
