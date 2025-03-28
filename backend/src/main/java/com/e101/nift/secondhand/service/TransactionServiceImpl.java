package com.e101.nift.secondhand.service;

import com.e101.nift.secondhand.model.state.ContractStatus;
import org.springframework.stereotype.Service;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.methods.response.EthGetTransactionReceipt;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.protocol.http.HttpService;

import java.io.IOException;
import java.util.Optional;

@Service
public class TransactionServiceImpl implements TransactionService{
    private final Web3j web3j;

    public TransactionServiceImpl() {
        this.web3j = Web3j.build(new HttpService("https://rpc.ssafy-blockchain.com"));
    }

    @Override
    public Optional<TransactionReceipt> getTransactionReceipt(String txHash) throws IOException {
        EthGetTransactionReceipt receiptResponse = web3j.ethGetTransactionReceipt(txHash).send();
        return receiptResponse.getTransactionReceipt();
    }

    @Override
    public String getTxStatus(String txHash) throws IOException {
        Optional<TransactionReceipt> receiptOpt = getTransactionReceipt(txHash);
        if (receiptOpt.isPresent()) {
            TransactionReceipt receipt = receiptOpt.get();
            boolean isSuccess = receipt.isStatusOK();
            return isSuccess ? ContractStatus.SUCCESS.getType() : ContractStatus.FAILED.getType();
        } else {
            return ContractStatus.FAILED.getType();
        }
    }
}
