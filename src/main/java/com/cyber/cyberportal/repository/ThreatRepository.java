package com.cyber.cyberportal.repository;

import com.cyber.cyberportal.model.Threat;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ThreatRepository extends JpaRepository<Threat, Long> {
}