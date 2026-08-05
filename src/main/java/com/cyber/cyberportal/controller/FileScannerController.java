package com.cyber.cyberportal.controller;

import com.cyber.cyberportal.model.ScanResponse;
import com.cyber.cyberportal.service.VirusTotalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class FileScannerController {

    @Autowired
    private VirusTotalService virusTotalService;

    @PostMapping("/scan")
    public ResponseEntity<?> scanFile(@RequestParam("file") MultipartFile file) {

        try {

            ScanResponse response = virusTotalService.scanFile(file);

            return ResponseEntity.ok(response);

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity.badRequest().body(e.getMessage());

        }

    }

}