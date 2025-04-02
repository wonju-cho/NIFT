package com.e101.nift.common.config;

import com.e101.nift.secondhand.exception.ArticleErrorCode;
import com.e101.nift.secondhand.exception.ArticleException;
import com.e101.nift.secondhand.model.contract.GifticonNFT;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Value;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.http.HttpService;
import org.web3j.tx.gas.DefaultGasProvider;

@Slf4j
@Configuration
public class Web3jConfig {
    private Web3j web3j;
    private GifticonNFT contract;

    @Value("${web3j.rpc.url}")
    private String rpcUrl;
    @Value("${web3j.private.key}")
    private String privateKey;
    @Value("${web3j.contract.address}")
    private String contractAddress;




    @Bean
    public Web3j web3j() {
        try {
            this.web3j = Web3j.build(new HttpService(rpcUrl));
            Credentials credentials = Credentials.create(privateKey);
            this.contract = GifticonNFT.load(contractAddress, web3j, credentials, new DefaultGasProvider());
        } catch (Exception e) {
            log.error("[Web3jConfig] Error initializing TransactionServiceImpl", e);
            throw new ArticleException(ArticleErrorCode.TRANSACTION_EXCEPTION);
        }

        return this.web3j;
    }
}