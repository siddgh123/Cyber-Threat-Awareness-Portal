# Cyber Threat Awareness Portal (CTAP)

A web-based Cyber Threat Awareness Portal designed to educate users about common cyber threats while providing basic URL threat detection and an interactive cybersecurity quiz.

The objective of this project is to improve cybersecurity awareness among users by combining learning resources, threat information, URL analysis, and knowledge assessment in a single platform.

---

## Project Overview

Cyber attacks such as phishing, malware, ransomware, and social engineering have become increasingly common. Many users unknowingly interact with malicious websites due to a lack of awareness.

The Cyber Threat Awareness Portal (CTAP) was developed to address this problem by providing an easy-to-use platform where users can:

- Learn about different cyber threats
- Detect whether a URL is safe or malicious
- Test their cybersecurity knowledge through quizzes
- Improve awareness using educational content

---

## Features

### User Authentication

- User Registration
- Secure Login
- Session management using Local Storage

### URL Threat Detection

- Detects whether a URL is Safe, Malicious, or Unknown
- Uses a CSV dataset containing known URLs
- REST API communication between frontend and backend

### Cyber Threat Awareness

- Displays information about common cyber threats
- Includes prevention techniques and security tips
- Data fetched dynamically from MySQL

### Cyber Security Quiz

- Multiple Choice Questions
- Automatic score calculation
- Stores quiz results in database
- Instant result display

---

## Technologies Used

### Frontend

- HTML5
- CSS3
- JavaScript
- Bootstrap

### Backend

- Java
- Spring Boot
- Spring Data JPA
- Hibernate

### Database

- MySQL

### Development Tools

- IntelliJ IDEA
- VS Code
- Postman
- Git & GitHub

---

## Project Architecture

```
Frontend (HTML/CSS/JavaScript)
            │
            ▼
      REST API Calls
            │
            ▼
Spring Boot Controllers
            │
            ▼
Service Layer (Business Logic)
            │
            ▼
Repository Layer (JPA)
            │
            ▼
Hibernate (ORM)
            │
            ▼
MySQL Database
```

---

## Project Structure

```
cyberportal
│
├── frontend
│   ├── index.html
│   ├── dashboard.html
│   ├── detect.html
│   ├── quiz.html
│   ├── threats.html
│   ├── script.js
│   └── style.css
│
├── backend
│   ├── controller
│   ├── service
│   ├── repository
│   ├── entity
│   ├── model
│   └── resources
│
├── database
│   └── cyber_portal.sql
│
└── README.md
```

---

## Modules

### Authentication Module

Handles user registration and login functionality.

### Threat Detection Module

Compares user-entered URLs with a dataset of known URLs and returns the detection result.

### Threat Awareness Module

Displays cybersecurity threats along with descriptions and prevention methods.

### Quiz Module

Loads questions from the database, evaluates user responses, calculates scores, and stores quiz results.

---

## Database Tables

The project uses the following MySQL tables:

- users
- threat
- quiz_question
- quiz_result

---

## How to Run the Project

### Clone the Repository

```bash
git clone https://github.com/yourusername/CTAP.git
```

### Import Backend

- Open IntelliJ IDEA
- Import as Maven Project
- Configure MySQL Database
- Run Spring Boot Application

Backend runs on:

```
http://localhost:8080
```

### Run Frontend

Simply open

```
index.html
```

or host it using VS Code Live Server.

---

## REST APIs

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | /api/auth/register | Register User |
| POST | /api/auth/login | User Login |
| POST | /api/detect | Detect URL |
| GET | /api/threats | Get Threat List |
| GET | /api/quiz_question/getQuiz | Load Quiz |
| POST | /api/quiz_question/submit | Submit Quiz |

---


## Future Enhancements

- Machine Learning based URL Detection
- Real-time Threat Intelligence API
- Email Notifications
- Admin Dashboard
- User Progress Tracking
- Password Encryption using BCrypt
- JWT Authentication
- Mobile Responsive UI Improvements

---

## Learning Outcomes

This project helped in understanding:

- Full Stack Web Development
- Spring Boot REST APIs
- MVC Architecture
- Hibernate & JPA
- MySQL Database Design
- JavaScript API Integration
- Frontend and Backend Integration
- Cybersecurity Awareness Concepts

---

## Developed By

**Siddhesh Ghadge**

Bachelor of Engineering (Computer Engineering)

---

## License

This project is developed for educational purposes.
Feel free to use it for learning and academic reference.
