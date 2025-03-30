package com.e101.nift.secondhand.service;

import com.e101.nift.common.util.TimeUtil;
import com.e101.nift.secondhand.entity.ArticleHistory;
import com.e101.nift.secondhand.exception.ArticleErrorCode;
import com.e101.nift.secondhand.exception.ArticleException;
import com.e101.nift.secondhand.model.contract.GifticonNFT;
import com.e101.nift.secondhand.model.state.ContractType;
import com.e101.nift.secondhand.repository.ArticleHistoryRepository;
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
    private final UserService userService;

    // TODO: 블록 마지막 sync가 겹칠 수 있으니, sync 테이블 추가 필요
    @Scheduled(fixedRate = 60000)
    public void realTimeSync() {
        log.info("[BatchService] 실시간 동기화 진행: {}", LocalDateTime.now());
        List<BigInteger> last50Blocks = transactionService.getLast50BlockNumbers();

        log.debug("[BatchService] 마지막 블록 번호: {}", last50Blocks.getLast());

        for(BigInteger block : last50Blocks) {
            List<GifticonNFT.NFTPurchasedEventResponse> purchasedEventResponseList = transactionService.getPurchaseEventsByBlockNumber(block);

            purchasedEventResponseList.parallelStream().forEach(response -> {
                try {
                    if(articleHistoryRepository.findByTxHash(response.log.getTransactionHash()).isEmpty()) {
                        log.debug("[BatchService] DB에 저장되지 않은 Hash 값: {}", response.log.getTransactionHash());
                        articleHistoryRepository.save(
                                ArticleHistory.builder()
                                        .articleId((long) 1) // TODO: smart contract 에서 tokenId값 이벤트 로그에 추가 필요, 현재 하드코딩 된 값 추후 변경 예정
                                        .createdAt(TimeUtil.convertTimestampToLocalTime(response.transactionTime))
                                        .historyType(ContractType.PURCHASE.getType())
                                        .userId(getUserId(response))
                                        .txHash(response.log.getTransactionHash())
                                        .build()
                        );
                    }
                } catch (Exception e) {
                    log.error("Failed to process txHash: {}", response.log.getTransactionHash(), e);
                }
            });
        }
    }

    private Long getUserId(GifticonNFT.NFTPurchasedEventResponse purchasedEventResponse) {
        return userService.findUserIdByAddress(purchasedEventResponse.buyer)
                .orElseThrow(() -> new ArticleException(ArticleErrorCode.CANNOT_FIND_BY_ADDRESS));
    }
}
