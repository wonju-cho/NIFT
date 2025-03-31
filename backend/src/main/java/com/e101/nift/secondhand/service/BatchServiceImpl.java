package com.e101.nift.secondhand.service;

import com.e101.nift.common.util.ConvertUtil;
import com.e101.nift.gifticon.entity.Gifticon;
import com.e101.nift.gifticon.repository.GifticonRepository;
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
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.math.BigInteger;
import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class BatchServiceImpl implements BatchService {
    private final TransactionService transactionService;
    private final ArticleHistoryRepository articleHistoryRepository;
    private final ArticleRepository articleRepository;
    private final GifticonRepository gifticonRepository;
    private final UserService userService;

    // TODO: 블록 마지막 sync가 겹칠 수 있으니, sync 테이블 추가 필요
    @Scheduled(fixedRate = 400000)
    public void realTimeSync() {
        log.info("[BatchService] 실시간 동기화 진행: {}", LocalDateTime.now());
        List<BigInteger> last50Blocks = transactionService.getLast50BlockNumbers();
        log.info("최근 50개 블록: {}", last50Blocks);

        log.debug("[BatchService] 마지막 블록 번호: {}", last50Blocks.getLast());

        for(BigInteger block : last50Blocks) {
//            handlePurchaseEvent(block);
            handleListForSaleEvent(block);
        }
    }

    private void handleListForSaleEvent(BigInteger block) {
        List<GifticonNFT.ListedForSaleEventResponse> listedForSaleEventResponses = transactionService.getListedForSaleEventsByBlockNumber(block);

        listedForSaleEventResponses.parallelStream().forEach(response -> {
            log.info("response: {}", response);
            try {
                if(articleRepository.findArticleByTxHash(response.log.getTransactionHash()).isEmpty()) {
                    log.debug("[BatchService] DB에 저장되지 않은 Hash 값: {}", response.log.getTransactionHash());

                    articleRepository.save(
                            Article.builder()
                                    .articleId(getArticleId(response.serialNumber.longValue()))
                                    .currentPrice(response.price.floatValue())
                                    .expirationDate(ConvertUtil.convertTimestampToLocalTime(response.expirationDate))
                                    .title("MISSING")
                                    .description("MISSING")
                                    .imageUrl(ConvertUtil.convertIpfsUrl(response.metadataURI))
                                    .viewCnt(0)
                                    .serialNum(response.serialNumber.longValue())
                                    .countLikes(0)
                                    .gifticon(getGifticon(response.tokenId.longValue()))
                                    .createdAt(ConvertUtil.convertTimestampToLocalTime(response.transactionTime))
                                    .txHash(response.log.getTransactionHash())
                                    .userId(getUserId(response.seller))
                                    .build()
                    );
                }
            } catch (Exception e) {
                log.error("[BatchService] Failed to process handleListForSaleEvent txHash: {}", response.log.getTransactionHash(), e);
            }
        });
    }

    private void handlePurchaseEvent(BigInteger block) {
        List<GifticonNFT.NFTPurchasedEventResponse> purchasedEventResponseList = transactionService.getPurchaseEventsByBlockNumber(block);

        purchasedEventResponseList.parallelStream().forEach(response -> {
            try {
                if(articleHistoryRepository.findByTxHash(response.log.getTransactionHash()).isEmpty()) {
                    log.debug("[BatchService] DB에 저장되지 않은 Hash 값: {}", response.log.getTransactionHash());
                    articleHistoryRepository.save(
                            ArticleHistory.builder()
                                    .articleId(getArticleId(response.serialNumber.longValue()))
                                    .createdAt(ConvertUtil.convertTimestampToLocalTime(response.transactionTime))
                                    .historyType(ContractType.PURCHASE.getType())
                                    .userId(getUserId(response.buyer))
                                    .txHash(response.log.getTransactionHash())
                                    .build()
                    );
                }
            } catch (Exception e) {
                log.error("[BatchService] Failed to process handlePurchaseEvent txHash: {}", response.log.getTransactionHash(), e);
            }
        });
    }

    private Gifticon getGifticon(Long gifticonId) {
        return gifticonRepository.findById(gifticonId)
                .orElseThrow(() -> new ArticleException(ArticleErrorCode.UNPROCESSABLE_TRANSACTION));
    }

    private Long getUserId(String userAddress) {
        return userService.findUserIdByAddress(userAddress)
                .orElseThrow(() -> new ArticleException(ArticleErrorCode.CANNOT_FIND_BY_ADDRESS));
    }

    private Long getArticleId(Long serialNumber) {
        return articleRepository.findArticleBySerialNum(serialNumber)
                .orElseThrow(() -> new ArticleException(ArticleErrorCode.UNPROCESSABLE_TRANSACTION))
                .getArticleId();
    }
}
