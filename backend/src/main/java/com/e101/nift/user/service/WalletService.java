package com.e101.nift.user.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.DefaultBlockParameterName;
import org.web3j.protocol.core.methods.response.EthGetBalance;
import org.web3j.protocol.http.HttpService;

import java.math.BigDecimal;
import java.math.BigInteger;

@Slf4j
@Service
public class WalletService {
    private final Web3j web3j;

    public WalletService() {
        // ✅ SSAFY 네트워크의 RPC URL을 사용하여 Web3j 초기화
        this.web3j = Web3j.build(new HttpService("https://rpc.ssafy-blockchain.com"));
        log.info("✅ Web3j SSAFY 네트워크 연결 완료!");
    }

    public BigDecimal getWalletBalance(String walletAddress) {
        try {
            log.info("🔍 [WalletService] 지갑 잔액 조회 요청: walletAddress={}", walletAddress);

            EthGetBalance balanceResponse = web3j.ethGetBalance(walletAddress, DefaultBlockParameterName.LATEST).send();
            BigInteger balanceInWei = balanceResponse.getBalance();

            BigDecimal balance = convertWeiToSsf(balanceInWei);
            log.info("✅ [WalletService] 지갑 잔액 조회 성공: walletAddress={}, balance={} SSF", walletAddress, balance);

            return balance;
        } catch (Exception e) {
            log.error("❌ [WalletService] 지갑 잔액 조회 실패! Address: {}", walletAddress, e);
            return BigDecimal.ZERO;
        }
    }

    // ✅ Wei → SSF 변환 (Ethereum과 동일한 10^18 단위 사용)
    private BigDecimal convertWeiToSsf(BigInteger wei) {
        return new BigDecimal(wei).divide(BigDecimal.valueOf(1_000_000_000_000_000_000L));
    }
}
