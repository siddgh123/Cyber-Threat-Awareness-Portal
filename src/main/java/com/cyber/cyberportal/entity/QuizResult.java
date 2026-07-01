package com.cyber.cyberportal.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
@Entity
public class QuizResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userEmail;
    private int score;


    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public void setScore(int score) {
        this.score = score;
    }
}