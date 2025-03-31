package com.e101.nift.secondhand.service;

public interface ContractService {
    void addArticleHistory(Long articleId, String txHash, Long loginUser);
}
