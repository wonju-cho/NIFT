package com.e101.nift.secondhand.service;

import com.e101.nift.secondhand.entity.ArticleHistory;
import com.e101.nift.secondhand.exception.ArticleErrorCode;
import com.e101.nift.secondhand.exception.ArticleException;
import com.e101.nift.secondhand.model.contract.GifticonNFT;
import com.e101.nift.secondhand.model.state.ContractType;
import com.e101.nift.secondhand.repository.ArticleHistoryRepository;
import com.e101.nift.secondhand.repository.ArticleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ContractServiceImpl implements ContractService {
    private final ArticleHistoryRepository articleHistoryRepository;
    private final ArticleRepository articleRepository;
    private final TransactionService transactionService;

    @Override
    public void addArticleHistory(Long articleId, String txHash, Long userId) {
        articleRepository.findById(articleId).orElseThrow(() -> new ArticleException(ArticleErrorCode.ARTICLE_NOT_FOUND));

        List<GifticonNFT.NFTPurchasedEventResponse> logs = transactionService.getPurchaseEventsByTxHash(txHash);

        log.info("[ContractService] 트랜잭션 로그 확인: {}",logs);

        articleHistoryRepository.save(
                ArticleHistory.builder()
                        .articleId(articleId)
                        .historyType(ContractType.PURCHASE.getType())
                        .userId(userId)
                        .build()
        );
    }
}
