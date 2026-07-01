package com.cyber.cyberportal.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "threat")
@Data
public class Threat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private String prevention;
}