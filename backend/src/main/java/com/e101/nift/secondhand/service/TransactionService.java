package com.e101.nift.secondhand.service;

import org.web3j.protocol.core.methods.response.Log;
import org.web3j.protocol.core.methods.response.TransactionReceipt;

import java.util.List;
import java.util.Optional;

public interface TransactionService {
    Optional<TransactionReceipt> getTransactionReceipt(String txHash);
    String getTxStatus(String txHash);
    List<Log> getTransactionLogs(String txHash);
}
