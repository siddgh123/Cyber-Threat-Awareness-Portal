package com.cyber.cyberportal.controller;

import com.cyber.cyberportal.service.DatasetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/detect")
@CrossOrigin
public class DetectionController {

    @Autowired
    private DatasetService datasetService;

    @PostMapping
    public Map<String, String> detect(@RequestBody Map<String, String> request) {

        String url = request.get("url");

        if (url == null || url.isEmpty()) {
            throw new RuntimeException("URL is empty");
        }

        String result = datasetService.checkUrl(url);

        Map<String, String> response = new HashMap<>();
        response.put("url", url);
        response.put("result", result);

        return response;
    }
}