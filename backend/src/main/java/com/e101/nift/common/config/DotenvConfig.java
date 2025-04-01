package com.e101.nift.common.config;

import org.springframework.context.annotation.Configuration;

import javax.annotation.PostConstruct;

@Configuration
public class DotenvConfig {

    @PostConstruct
    public void init() {
        Dotenv dotenv = Dotenv.load();

        System.setProperty("web3j.private.key", dotenv.get("PRIVATE_KEY"));
    }
}
