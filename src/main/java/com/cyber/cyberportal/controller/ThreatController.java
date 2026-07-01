package com.cyber.cyberportal.controller;

import com.cyber.cyberportal.model.Threat;
import com.cyber.cyberportal.repository.ThreatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/threats")
@CrossOrigin
public class ThreatController {

    @Autowired
    private ThreatRepository repo;

    @GetMapping
    public List<Threat> getAll() {
        return repo.findAll();
    }
}