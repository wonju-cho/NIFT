package com.e101.nift.secondhand.service;

import com.e101.nift.common.util.ConvertUtil;
import com.e101.nift.secondhand.entity.Article;
import com.e101.nift.secondhand.entity.ArticleHistory;
import com.e101.nift.secondhand.exception.ArticleErrorCode;
import com.e101.nift.secondhand.exception.ArticleException;
import com.e101.nift.secondhand.model.contract.GifticonNFT;
import com.e101.nift.secondhand.model.state.ContractType;
import com.e101.nift.secondhand.repository.ArticleHistoryRepository;
import com.e101.nift.secondhand.repository.ArticleRepository;
import com.e101.nift.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class ContractServiceImpl implements ContractService {
    private final ArticleHistoryRepository articleHistoryRepository;
    private final ArticleRepository articleRepository;
    private final TransactionService transactionService;
    private final UserService userService;

    @Override
    public void addArticleHistory(Long articleId, String txHash, Long loginUser) {
        Article article = articleRepository.findById(articleId).orElseThrow(() -> new ArticleException(ArticleErrorCode.ARTICLE_NOT_FOUND));

        GifticonNFT.NFTPurchasedEventResponse purchasedEventResponse = transactionService.getPurchaseEventsByTxHash(txHash).getFirst();

        log.debug("[ContractService] 트랜잭션 발생 시간: {}", ConvertUtil.convertTimestampToLocalTime(purchasedEventResponse.transactionTime));
        log.debug("[ContractService] 트랜잭션 유저 지갑 주소: {}", purchasedEventResponse.buyer);

        Long userId = userService.findUserIdByAddress(purchasedEventResponse.buyer)
                .orElseThrow(() -> new ArticleException(ArticleErrorCode.CANNOT_FIND_BY_ADDRESS));

        if(!userId.equals(loginUser)) {
            log.info("[ContractService] 트랜잭션 유저 정보: {} {}", userId, loginUser);
            throw new ArticleException(ArticleErrorCode.USER_MISMATCH);
        }

        articleHistoryRepository.save(
                ArticleHistory.builder()
                        .articleId(articleId)
                        .createdAt(ConvertUtil.convertTimestampToLocalTime(purchasedEventResponse.transactionTime))
                        .historyType(ContractType.PURCHASE.getType())
                        .userId(userId)
                        .txHash(txHash)
                        .build()
        );
        article.setSold(true);
        articleRepository.save(article);
    }
}
