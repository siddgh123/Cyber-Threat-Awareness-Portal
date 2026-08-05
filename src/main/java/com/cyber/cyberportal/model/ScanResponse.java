package com.cyber.cyberportal.model;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class ScanResponse {

    private boolean safe;
    private String message;
    private int malicious;
    private int suspicious;

}