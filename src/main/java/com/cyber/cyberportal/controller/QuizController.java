package com.cyber.cyberportal.controller;

import com.cyber.cyberportal.entity.Quiz;
import com.cyber.cyberportal.service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
@RestController
@RequestMapping("/api/quiz_question")
@CrossOrigin
public class QuizController {

    @Autowired
    private QuizService service;

    @GetMapping("/getQuiz")
    public List<Quiz> getQuiz() {
        return service.getAllQuestions();
    }
    @GetMapping("/test")
    public String test() {
        return "WORKING";
    }
    @PostMapping("/submit")
    public Map<String, Object> submitQuiz(@RequestBody Map<String, Object> payload) {

        String email = (String) payload.get("userEmail");
        Map<String, String> answersRaw = (Map<String, String>) payload.get("answers");

        Map<Long, String> answers = new java.util.HashMap<>();

        for (Map.Entry<String, String> entry : answersRaw.entrySet()) {
            answers.put(Long.parseLong(entry.getKey()), entry.getValue());
        }

        int score = service.submitQuiz(email, answers);

        Map<String, Object> response = new HashMap<>();
        response.put("score", score);
        response.put("message", "Quiz submitted successfully");

        return response;
    }
}