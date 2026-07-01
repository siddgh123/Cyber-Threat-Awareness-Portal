package com.cyber.cyberportal.service;

import com.cyber.cyberportal.entity.Quiz;
import com.cyber.cyberportal.entity.QuizResult;
import com.cyber.cyberportal.repository.QuizRepository;
import com.cyber.cyberportal.repository.QuizResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class QuizService {

    @Autowired
    private QuizRepository quizRepo;

    @Autowired
    private QuizResultRepository resultRepo;

    // ✅ Get all questions
    public List<Quiz> getAllQuestions() {
        return quizRepo.findAll();
    }

    // ✅ Submit quiz
    public int submitQuiz(String email, Map<Long, String> answers) {

        List<Quiz> questions = quizRepo.findAll();
        int score = 0;

        for (Quiz q : questions) {

            String correctLetter = q.getCorrectAnswer(); // A/B/C/D

            String correctValue = switch (correctLetter) {
                case "A" -> q.getOptionA();
                case "B" -> q.getOptionB();
                case "C" -> q.getOptionC();
                case "D" -> q.getOptionD();
                default -> "";
            };

            String userAnswer = answers.get(q.getId());

            if (correctValue.equalsIgnoreCase(userAnswer)) {
                score++;
            }
        }

        QuizResult result = new QuizResult();
        result.setUserEmail(email);
        result.setScore(score);

        resultRepo.save(result);

        return score;
    }
}