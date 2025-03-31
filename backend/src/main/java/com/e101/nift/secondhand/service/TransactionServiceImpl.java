package com.e101.nift.secondhand.service;

import com.e101.nift.secondhand.exception.ArticleErrorCode;
import com.e101.nift.secondhand.exception.ArticleException;
import com.e101.nift.secondhand.model.contract.GifticonNFT;
import com.e101.nift.secondhand.model.state.ContractStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.DefaultBlockParameter;
import org.web3j.protocol.core.methods.request.EthFilter;
import org.web3j.protocol.core.methods.response.EthGetTransactionReceipt;
import org.web3j.protocol.core.methods.response.Log;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.protocol.http.HttpService;
import org.web3j.tx.gas.DefaultGasProvider;

import java.io.IOException;
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class TransactionServiceImpl implements TransactionService {

    private final Web3j web3j;
    private final GifticonNFT contract;
    private final String privateKey;
    private final String contractAddress;

    public TransactionServiceImpl(@Value("${web3j.rpc.url}") String rpcUrl,
                                  @Value("${web3j.contract.address}") String contractAddress,
                                  @Value("${web3j.private.key}") String privateKey) {
        this.contractAddress = contractAddress;
        this.privateKey = privateKey;

        try {
            // Web3j 객체 초기화
            this.web3j = Web3j.build(new HttpService(rpcUrl));
            Credentials credentials = Credentials.create(privateKey);
            this.contract = GifticonNFT.load(contractAddress, web3j, credentials, new DefaultGasProvider());
        } catch (Exception e) {
            log.error("Error initializing TransactionServiceImpl", e);
            throw new ArticleException(ArticleErrorCode.TRANSACTION_EXCEPTION);
        }
    }

    @Override
    public Optional<TransactionReceipt> getTransactionReceipt(String txHash) {
        try {
            EthGetTransactionReceipt receiptResponse = web3j.ethGetTransactionReceipt(txHash).send();
            return receiptResponse.getTransactionReceipt();
        } catch (IOException e) {
            log.error("Failed to get transaction receipt for txHash: {}", txHash, e);
            throw new ArticleException(ArticleErrorCode.TRANSACTION_EXCEPTION);
        }
    }

    @Override
    public String getTxStatus(String txHash) {
        Optional<TransactionReceipt> receiptOpt = getTransactionReceipt(txHash);
        return receiptOpt
                .filter(TransactionReceipt::isStatusOK)
                .map(receipt -> ContractStatus.SUCCESS.getType())
                .orElseThrow(() -> {
                    log.error("Transaction failed or not processed: {}", txHash);
                    return new ArticleException(ArticleErrorCode.TRANSACTION_EXCEPTION);
                });
    }

    @Override
    public List<Log> getTransactionLogs(String txHash) {
        return getTransactionReceipt(txHash)
                .map(TransactionReceipt::getLogs)
                .orElseThrow(() -> {
                    log.error("No logs found for transaction: {}", txHash);
                    return new ArticleException(ArticleErrorCode.TRANSACTION_EXCEPTION);
                });
    }

    @Override
    public List<GifticonNFT.NFTPurchasedEventResponse> getPurchaseEventsByTxHash(String txHash) {
        Optional<TransactionReceipt> receiptOpt = getTransactionReceipt(txHash);
        TransactionReceipt receipt = receiptOpt
                .filter(TransactionReceipt::isStatusOK)
                .orElseThrow(() -> {
                    log.error("Transaction failed or not processed: {}", txHash);
                    return new ArticleException(ArticleErrorCode.TRANSACTION_EXCEPTION);
                });

        List<GifticonNFT.NFTPurchasedEventResponse> events = GifticonNFT.getNFTPurchasedEvents(receipt);

        if (events.isEmpty()) {
            log.error("No purchase events found for transaction: {}", txHash);
            throw new ArticleException(ArticleErrorCode.TRANSACTION_EXCEPTION);
        }

        return events;
    }

    @Override
    public List<BigInteger> getLast50BlockNumbers() {
        try {
            BigInteger latestBlockNumber = web3j.ethBlockNumber().send().getBlockNumber();
            List<BigInteger> blockNumbers = new ArrayList<>();

            for (int i = 0; i < 50; i++) {
                blockNumbers.add(latestBlockNumber.subtract(BigInteger.valueOf(i)));
            }

            log.debug("[TransactionService] getLast50BlockNumbers: {}", blockNumbers);
            return blockNumbers;
        } catch (IOException e) {
            log.error("Failed to fetch latest block number", e);
            throw new ArticleException(ArticleErrorCode.TRANSACTION_EXCEPTION);
        }
    }

    @Override
    public List<GifticonNFT.NFTPurchasedEventResponse> getPurchaseEventsByBlockNumber(BigInteger blockNumber) {
        try {
            EthFilter filter = new EthFilter(
                    DefaultBlockParameter.valueOf(blockNumber),
                    DefaultBlockParameter.valueOf(blockNumber),
                    this.contractAddress
            );

            List<org.web3j.protocol.core.methods.response.Log> logs = web3j.ethGetLogs(filter).send().getLogs()
                    .stream()
                    .map(logResult -> (org.web3j.protocol.core.methods.response.Log) logResult.get())
                    .toList();

            List<GifticonNFT.NFTPurchasedEventResponse> events = new ArrayList<>();

            for (org.web3j.protocol.core.methods.response.Log log : logs) {
                GifticonNFT.NFTPurchasedEventResponse event = GifticonNFT.getNFTPurchasedEventFromLog(log);
                events.add(event);
            }

            return events;
        } catch (Exception e) {
            log.error("Failed to fetch purchase events for block: {}", blockNumber, e);
            throw new ArticleException(ArticleErrorCode.TRANSACTION_EXCEPTION);
        }
    }
}


