package com.e101.nift.common.config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

import javax.annotation.PostConstruct;

@Configuration
public class DotenvConfig {

    private final Environment environment;

    public DotenvConfig(Environment environment) {
        this.environment = environment;
    }

    @PostConstruct
    public void init() {
        Dotenv dotenv = Dotenv.load();
        System.setProperty("web3j.rpc.url", dotenv.get("WEB3J_RPC_URL"));
        System.setProperty("web3j.contract.address", dotenv.get("CONTRACT_ADDRESS"));
        System.setProperty("web3j.private.key", dotenv.get("PRIVATE_KEY"));
    }
}
