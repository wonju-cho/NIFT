package com.e101.nift.common.config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.annotation.Configuration;

import javax.annotation.PostConstruct;

@Configuration
public class DotenvConfig {

    @PostConstruct
    public void init() {
        String privateKey = System.getenv("WEB3J_PRIVATE_KEY");
        System.setProperty("web3j.private.key", privateKey);
    }
}
