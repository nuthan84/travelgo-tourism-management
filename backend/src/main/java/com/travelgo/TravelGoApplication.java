package com.travelgo;

import com.travelgo.config.DotenvConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class TravelGoApplication {

    public static void main(String[] args) {
        DotenvConfig.loadSystemProperties();
        SpringApplication.run(TravelGoApplication.class, args);
    }
}
