package com.e101.nift.gift.service;

import com.e101.nift.common.util.ConvertUtil;
import com.e101.nift.gift.entity.GiftHistory;
import com.e101.nift.gift.model.dto.request.ReceivedGiftDto;
import com.e101.nift.gift.model.dto.request.SendGiftDto;
import com.e101.nift.gift.model.dto.response.SendGiftHistoryDto;
import com.e101.nift.gift.repository.GiftHistoryRepository;
import com.e101.nift.gifticon.entity.Gifticon;
import com.e101.nift.gifticon.repository.GifticonRepository;
import com.e101.nift.secondhand.entity.Article;
import com.e101.nift.secondhand.exception.GiftHistoryErrorCode;
import com.e101.nift.secondhand.exception.GiftHistoryException;
import com.e101.nift.secondhand.model.contract.GifticonNFT;
import com.e101.nift.secondhand.model.dto.response.ScrollDto;
import com.e101.nift.secondhand.service.ContractService;
import com.e101.nift.secondhand.service.TransactionService;
import com.e101.nift.user.entity.User;
import com.e101.nift.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class GiftHistoryServiceImpl implements GiftHistoryService {

    private final GiftHistoryRepository giftHistoryRepository;
    private final GifticonRepository gifticonRepository;
    private final UserRepository userRepository;
    private final ContractService contractService;
    private final TransactionService transactionService;

    @Override
    public ScrollDto<SendGiftHistoryDto> getSendGiftHistories(Long senderId, Pageable pageable) {
        Page<GiftHistory> historiesPage = giftHistoryRepository.findByFromUserId_UserId(senderId, pageable);

        List<SendGiftHistoryDto> content = historiesPage.stream().map(history -> {
            Gifticon gifticon = gifticonRepository.findByGifticonId(history.getGifticon().getGifticonId())
                    .orElseThrow(() -> new RuntimeException("기프티콘 정보를 찾을 수 없습니다."));

            String toNickName = userRepository.findByUserId(history.getToUserId())
                    .map(User::getNickName)
                    .orElse("아직 가입하지 않은 회원입니다");

            return new SendGiftHistoryDto(
                    history.getGiftHistoryId(),
                    gifticon.getGifticonTitle(),
                    gifticon.getImageUrl(),
                    toNickName,
                    history.getCreatedAt()
            );
        }).toList();

        return new ScrollDto<>(content, historiesPage.hasNext());
    }

    @Override
    @Transactional
    public void sendGiftHistory(Long senderId, SendGiftDto request) {
        GifticonNFT.GiftPendingEventResponse giftPendingEventResponse = transactionService.getGiftPendingEventByTxHash(request.getTxHashGift()).getFirst();
        log.info("[GiftHistoryService] giftPendingEventResponse: {}", giftPendingEventResponse);

        User sender = userRepository.findByWalletAddress(giftPendingEventResponse.sender)
                .orElseThrow(() -> new GiftHistoryException(GiftHistoryErrorCode.CANNOT_FIND_BY_ADDRESS));
        log.info("[GiftHistoryService] senderId가 일치합니다: {}", sender.getUserId());

        User receiver = userRepository.findByKakaoId(request.getToUserKakaoId())
                .orElseThrow(() -> new GiftHistoryException(GiftHistoryErrorCode.CANNOT_FIND_BY_ADDRESS));
        log.info("[GiftHistoryService] receiverId가 일치합니다: {}", request.getToUserKakaoId());

        Gifticon gifticon = gifticonRepository.findByGifticonId(giftPendingEventResponse.tokenId.longValue())
                .orElseThrow(() -> new GiftHistoryException(GiftHistoryErrorCode.UNPROCESSABLE_TRANSACTION));
        log.info("[GiftHistoryService] 선물하고자 하는 gifticon이 존재합니다: {}", gifticon);

        if ("article".equals(request.getType())) {
            giftFromArticle(senderId, request, giftPendingEventResponse);
            log.info("[GiftHistoryService] 구매 완료");
        }

        // 선물 기록 저장
        GiftHistory giftHistory = GiftHistory.builder()
                .fromUserId(sender)
                .toUserId(receiver.getUserId())
                .toUserKakaoId(receiver.getKakaoId())
                .gifticon(gifticon)
                .mongoId(request.getMongoId())
                .isReceived(false)
                .serialNum(giftPendingEventResponse.serialNumber.longValue())
                .createdAt(ConvertUtil.convertTimestampToLocalTime(giftPendingEventResponse.transactionTime))
                .txHash(request.getTxHashGift())
                .build();
        giftHistoryRepository.save(giftHistory);
        log.info("[GiftHistoryService] giftHistory 저장 완료");
    }

    @Override
    public void receivedGiftHistory(Long receiverId, ReceivedGiftDto receivedGiftDto) {
        GifticonNFT.GiftedEventResponse giftedEventResponse = transactionService.getGiftedEventByTxHash(receivedGiftDto.getTxHash()).getFirst();
        log.info("[GiftHistoryService] giftedEventResponse: {}", giftedEventResponse);

        User receiver = userRepository.findByWalletAddress(giftedEventResponse.recipient)
                .orElseThrow(() -> new GiftHistoryException(GiftHistoryErrorCode.CANNOT_FIND_BY_ADDRESS));
        log.info("[GiftHistoryService] senderId가 일치합니다: {}", receiver.getUserId());

        if (!receiver.getUserId().equals(receiverId)) {
            throw new GiftHistoryException(GiftHistoryErrorCode.UNPROCESSABLE_TRANSACTION);
        }
        log.info("[GiftHistoryService] 로그인한 사용자와 sender가 일치합니다: {}", receiverId);

        GiftHistory giftHistory = giftHistoryRepository.findBySerialNum(giftedEventResponse.serialNumber.longValue())
                .orElseThrow(() -> new GiftHistoryException(GiftHistoryErrorCode.UNPROCESSABLE_TRANSACTION));
        log.info("[GiftHistoryService] 선물 받은 기록이 있습니다: {}", giftHistory);

        giftHistory.setReceived(true);
        giftHistoryRepository.save(giftHistory);
    }

    private void giftFromArticle(Long senderId, SendGiftDto request, GifticonNFT.GiftPendingEventResponse giftPendingEventResponse) {
        Article article = transactionService.getArticle(giftPendingEventResponse.serialNumber);

        contractService.addArticleHistory(article.getArticleId(), request.getTxHashPurchase(), senderId);
    }
}
