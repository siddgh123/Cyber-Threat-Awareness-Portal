package com.cyber.cyberportal.service;


import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Service
public class DatasetService {

    private List<String[]> data = new ArrayList<>();

    @PostConstruct
    public void loadDataset() {
        try {
            InputStream inputStream = getClass()
                    .getClassLoader()
                    .getResourceAsStream("dataset/urls.csv");

            if (inputStream == null) {
                throw new RuntimeException("CSV file not found in resources!");
            }

            BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
            String line;

            while ((line = reader.readLine()) != null) {
                String[] parts = line.split(",");
                data.add(parts);
            }

            System.out.println("Dataset loaded: " + data.size());

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public String checkUrl(String url) {
        for (String[] row : data) {
            if (row[0].equalsIgnoreCase(url)) {
                return row[1];
            }
        }
        return "unknown";
    }
}