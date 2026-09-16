package com.travelgo.repository;

import com.travelgo.entity.Destination;
import com.travelgo.entity.DestinationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DestinationRepository extends JpaRepository<Destination, Long> {
    List<Destination> findByStatus(DestinationStatus status);
}
