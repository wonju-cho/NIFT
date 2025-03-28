package com.e101.nift.secondhand.service;

import com.e101.nift.secondhand.exception.ArticleErrorCode;
import com.e101.nift.secondhand.exception.ArticleException;
import com.e101.nift.secondhand.model.state.ContractStatus;
import org.springframework.stereotype.Service;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.methods.response.EthGetTransactionReceipt;
import org.web3j.protocol.core.methods.response.Log;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.protocol.http.HttpService;

import java.io.IOException;
import java.math.BigInteger;
import java.util.List;
import java.util.Optional;

@Service
public class TransactionServiceImpl implements TransactionService{
    private final Web3j web3j;

    public TransactionServiceImpl() {
        this.web3j = Web3j.build(new HttpService("https://rpc.ssafy-blockchain.com"));
    }

    @Override
    public Optional<TransactionReceipt> getTransactionReceipt(String txHash) {
        try {
            EthGetTransactionReceipt receiptResponse = web3j.ethGetTransactionReceipt(txHash).send();
            return receiptResponse.getTransactionReceipt();
        } catch (IOException e) {
            throw new ArticleException(ArticleErrorCode.TRANSACTION_EXCEPTION);
        }
    }

    @Override
    public String getTxStatus(String txHash) {
        Optional<TransactionReceipt> receiptOpt = getTransactionReceipt(txHash);
        return receiptOpt
                .filter(TransactionReceipt::isStatusOK)
                .map(receipt -> ContractStatus.SUCCESS.getType())
                .orElseThrow(() -> new ArticleException(ArticleErrorCode.UNPROCESSABLE_TRANSACTION));
    }

    @Override
    public List<Log> getTransactionLogs(String txHash) {
        return getTransactionReceipt(txHash)
                .map(TransactionReceipt::getLogs)
                .orElseThrow(() -> new ArticleException(ArticleErrorCode.UNPROCESSABLE_TRANSACTION));
    }

}
