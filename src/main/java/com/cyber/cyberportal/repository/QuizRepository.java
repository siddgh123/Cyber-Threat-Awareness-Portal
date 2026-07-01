package com.cyber.cyberportal.repository;

import com.cyber.cyberportal.entity.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuizRepository extends JpaRepository<Quiz, Long> {
}