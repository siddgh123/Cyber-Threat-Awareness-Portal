package com.cyber.cyberportal.service;

import com.cyber.cyberportal.model.User;
import com.cyber.cyberportal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository repo;

    public String register(User user){
        repo.save(user);
        return "User Registered Successfully";
    }

    public User login(String email, String password){
        User user = repo.findByEmail(email);

        if(user != null && user.getPassword().equals(password)){
            return user;
        }
        return null;
    }
}