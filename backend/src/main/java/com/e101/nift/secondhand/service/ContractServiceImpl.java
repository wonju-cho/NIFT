package com.e101.nift.secondhand.service;

import com.e101.nift.secondhand.entity.ArticleHistory;
import com.e101.nift.secondhand.exception.ArticleErrorCode;
import com.e101.nift.secondhand.exception.ArticleException;
import com.e101.nift.secondhand.model.state.ContractType;
import com.e101.nift.secondhand.repository.ArticleHistoryRepository;
import com.e101.nift.secondhand.repository.ArticleRepository;
import com.e101.nift.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.web3j.abi.EventEncoder;
import org.web3j.abi.FunctionReturnDecoder;
import org.web3j.abi.TypeReference;
import org.web3j.abi.datatypes.Address;
import org.web3j.abi.datatypes.Event;
import org.web3j.abi.datatypes.Type;
import org.web3j.abi.datatypes.generated.Uint256;
import org.web3j.protocol.core.methods.response.Log;

import java.math.BigInteger;
import java.util.Arrays;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ContractServiceImpl implements ContractService {
    private final ArticleHistoryRepository articleHistoryRepository;
    private final ArticleRepository articleRepository;
    private final TransactionService transactionService;

    // 이벤트 정의
    private static final Event NFT_PURCHASED_EVENT = new Event("NFTPurchased",
            Arrays.asList(
                    TypeReference.create(Address.class, true),   // indexed: buyer
                    TypeReference.create(Uint256.class),         // non-indexed: serialNumber
                    TypeReference.create(Uint256.class)          // non-indexed: price
            )
    );
    private final UserService userService;

    @Override
    public void addArticleHistory(Long articleId, String txHash, Long userId) {
        articleRepository.findById(articleId)
                .orElseThrow(() -> new ArticleException(ArticleErrorCode.ARTICLE_NOT_FOUND));

        List<Log> logs = transactionService.getTransactionLogs(txHash);

        for (Log log : logs) {
            // 이벤트 시그니처 매칭
            if (log.getTopics().get(0).equals(EventEncoder.encode(NFT_PURCHASED_EVENT))) {
                // buyer (indexed address)
                String buyerWallet = "0x" + log.getTopics().get(1).substring(26);

                // data 디코딩 (serialNumber, price)
                List<Type> decoded = FunctionReturnDecoder.decode(
                        log.getData(),
                        NFT_PURCHASED_EVENT.getNonIndexedParameters()
                );

//                BigInteger serialNumber = (BigInteger) decoded.get(0).getValue();
//                BigInteger price = (BigInteger) decoded.get(1).getValue();

                System.out.println(" ❤️❤️❤️ addArticleHistory 진입 - articleId: " + articleId + ", txHash: " + txHash);

                Long buyerId = userService.getUserIdByWalletAddress(buyerWallet);
                if (buyerId == null) {
                    throw new ArticleException(ArticleErrorCode.TRANSACTION_EXCEPTION);
                }
                // 구매자 기록 저장
                articleHistoryRepository.save(
                        ArticleHistory.builder()
                                .articleId(articleId)
                                .historyType(ContractType.PURCHASE.getType())
                                .userId(buyerId)
                                .build()
                );

                // 판매자 기록 저장
                articleHistoryRepository.save(
                        ArticleHistory.builder()
                                .articleId(articleId)
                                .historyType(ContractType.SALE.getType())
                                .userId(userId) // 이건 게시글 등록자 → sellerId
                                .build()
                );
                return; // 이벤트 하나만 처리하고 종료
            }
        }

        // 이벤트를 못 찾았을 경우
        throw new ArticleException(ArticleErrorCode.TRANSACTION_EXCEPTION);
    }
}
