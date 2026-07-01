package com.cyber.cyberportal;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.cyber.cyberportal")
public class CyberportalApplication {

	public static void main(String[] args) {
		SpringApplication.run(CyberportalApplication.class, args);
	}

}
