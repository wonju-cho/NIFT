package com.e101.nift.secondhand.service;

import org.web3j.protocol.core.methods.response.TransactionReceipt;

import java.io.IOException;
import java.util.Optional;

public interface TransactionService {
    Optional<TransactionReceipt> getTransactionReceipt(String txHash) throws IOException;
    String getTxStatus(String txHash) throws IOException;
}
