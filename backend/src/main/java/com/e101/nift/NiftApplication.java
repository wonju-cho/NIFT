package com.e101.nift;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication(scanBasePackages = "com.e101.nift")
public class NiftApplication {

	public static void main(String[] args) {
		SpringApplication.run(NiftApplication.class, args);
	}

}
