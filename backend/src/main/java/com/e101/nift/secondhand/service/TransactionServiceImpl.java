package com.e101.nift.secondhand.service;

import com.e101.nift.secondhand.exception.ArticleErrorCode;
import com.e101.nift.secondhand.exception.ArticleException;
import com.e101.nift.secondhand.model.contract.GifticonNFT;
import com.e101.nift.secondhand.model.state.ContractStatus;
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
            log.error("[TransactionService] Error initializing TransactionServiceImpl", e);
            throw new ArticleException(ArticleErrorCode.TRANSACTION_EXCEPTION);
        }
    }

    @Override
    public Optional<TransactionReceipt> getTransactionReceipt(String txHash) {
        try {
            EthGetTransactionReceipt receiptResponse = web3j.ethGetTransactionReceipt(txHash).send();
            return receiptResponse.getTransactionReceipt();
        } catch (IOException e) {
            log.error("[TransactionService] Failed to get transaction receipt for txHash: {}", txHash, e);
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
                    log.error("[TransactionService] Transaction failed or not processed: {}", txHash);
                    return new ArticleException(ArticleErrorCode.TRANSACTION_EXCEPTION);
                });
    }

    @Override
    public List<Log> getTransactionLogs(String txHash) {
        return getTransactionReceipt(txHash)
                .map(TransactionReceipt::getLogs)
                .orElseThrow(() -> {
                    log.error("[TransactionService] No logs found for transaction: {}", txHash);
                    return new ArticleException(ArticleErrorCode.TRANSACTION_EXCEPTION);
                });
    }

    @Override
    public BigInteger getLatestBlockNumber() {
        try {
            return web3j.ethBlockNumber().send().getBlockNumber();
        } catch (IOException e) {
            log.error("[TransactionService] 마지막 블록 가져오기 실패: {}", e.getMessage());
            throw new ArticleException(ArticleErrorCode.TRANSACTION_EXCEPTION);
        }
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
            log.error("[TransactionService] No purchase events found for transaction: {}", txHash);
            throw new ArticleException(ArticleErrorCode.TRANSACTION_EXCEPTION);
        }

        return events;
    }

    @Override
    public List<GifticonNFT.ListedForSaleEventResponse> getListedForSaleEventByTxHash(String txHash) {
        Optional<TransactionReceipt> receiptOpt = getTransactionReceipt(txHash);
        TransactionReceipt receipt = receiptOpt
                .filter(TransactionReceipt::isStatusOK)
                .orElseThrow(() -> {
                    log.error("Transaction failed or not processed: {}", txHash);
                    return new ArticleException(ArticleErrorCode.TRANSACTION_EXCEPTION);
                });

        List<GifticonNFT.ListedForSaleEventResponse> events = GifticonNFT.getListedForSaleEvents(receipt);
        log.info("[TransactionService] getListedForSaleEvents : {}", events);
        if (events.isEmpty()) {
            log.error("[TransactionService] No purchase events found for transaction: {}", txHash);
            throw new ArticleException(ArticleErrorCode.TRANSACTION_EXCEPTION);
        }

        return events;
    }

    @Override
    public List<GifticonNFT.GiftPendingEventResponse> getGiftPendingEventByTxHash(String txHash) {
        Optional<TransactionReceipt> receiptOpt = getTransactionReceipt(txHash);
        TransactionReceipt receipt = receiptOpt
                .filter(TransactionReceipt::isStatusOK)
                .orElseThrow(() -> {
                    log.error("[TransactionService] Transaction failed or not processed: {}", txHash);
                    return new ArticleException(ArticleErrorCode.TRANSACTION_EXCEPTION);
                });

        List<GifticonNFT.GiftPendingEventResponse> events = GifticonNFT.getGiftPendingEvents(receipt);
        log.info("[TransactionService] getGiftedEvents : {}", events);
        if (events.isEmpty()) {
            log.error("[TransactionService] No gift events found for transaction: {}", txHash);
            throw new ArticleException(ArticleErrorCode.TRANSACTION_EXCEPTION);
        }

        return events;
    }

    @Override
    public List<BigInteger> getBlockNumbersFrom(BigInteger startBlock) {
        try {
            List<BigInteger> blockNumbers = new ArrayList<>();

            for (int i = 0; i < 10; i++) {
                blockNumbers.add(startBlock.add(BigInteger.valueOf(i)));
            }

            log.debug("[TransactionService] getBlockNumbersFrom: {}", blockNumbers);
            return blockNumbers;
        } catch (Exception e) {
            log.error("[TransactionService] Failed to fetch block numbers from {}", startBlock, e);
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

            for (org.web3j.protocol.core.methods.response.Log logg : logs) {
                GifticonNFT.NFTPurchasedEventResponse event = GifticonNFT.getNFTPurchasedEventFromLog(logg);
                if (event != null) {
                    events.add(event);
                }
            }

            return events;
        } catch (Exception e) {
            log.error("[TransactionService] Failed to fetch purchase events for block: {}", blockNumber, e);
            throw new ArticleException(ArticleErrorCode.TRANSACTION_EXCEPTION);
        }
    }

    @Override
    public List<GifticonNFT.ListedForSaleEventResponse> getListedForSaleEventsByBlockNumber(BigInteger blockNumber) {
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

            log.info("블록 [{}] 에서 가져온 로그 개수: {}", blockNumber, logs.size());

            List<GifticonNFT.ListedForSaleEventResponse> events = new ArrayList<>();

            for (org.web3j.protocol.core.methods.response.Log logg : logs) {
                log.info("로그 내용: address={}, topics={}, data={}", logg.getAddress(), logg.getTopics(), logg.getData());
                GifticonNFT.ListedForSaleEventResponse event = GifticonNFT.getListedForSaleEventFromLog(logg);
                if (event != null) {
                    events.add(event);
                }
                events.add(event);
            }

            return events;
        } catch (Exception e) {
            log.error("[TransactionService] Failed to fetch list_for_sale events for block: {}", blockNumber, e);
            throw new ArticleException(ArticleErrorCode.TRANSACTION_EXCEPTION);
        }
    }
}


