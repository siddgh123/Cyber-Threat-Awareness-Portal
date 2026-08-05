package com.cyber.cyberportal.dto;

import lombok.Data;

@Data
public class VirusTotalResponse {

    private boolean safe;

    private int malicious;

    private int suspicious;

    private String message;
}