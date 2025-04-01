package com.e101.nift.secondhand.service;

import com.e101.nift.secondhand.model.contract.GifticonNFT;
import org.web3j.protocol.core.methods.response.Log;
import org.web3j.protocol.core.methods.response.TransactionReceipt;

import java.math.BigInteger;
import java.util.List;
import java.util.Optional;

public interface TransactionService {
    Optional<TransactionReceipt> getTransactionReceipt(String txHash);
    String getTxStatus(String txHash);
    List<Log> getTransactionLogs(String txHash);
    BigInteger getLatestBlockNumber();
    List<GifticonNFT.NFTPurchasedEventResponse> getPurchaseEventsByTxHash(String txHash);
    List<GifticonNFT.ListedForSaleEventResponse> getListedForSaleEventByTxHash(String txHash);
    List<GifticonNFT.GiftPendingEventResponse> getGiftPendingEventByTxHash(String txHash);
    List<BigInteger> getBlockNumbersFrom(BigInteger startBlock);
    List<GifticonNFT.NFTPurchasedEventResponse> getPurchaseEventsByBlockNumber(BigInteger blockNumber);
    List<GifticonNFT.ListedForSaleEventResponse> getListedForSaleEventsByBlockNumber(BigInteger blockNumber);
}
