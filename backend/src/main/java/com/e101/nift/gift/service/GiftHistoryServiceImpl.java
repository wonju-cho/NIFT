package com.e101.nift.gift.service;

import com.e101.nift.gift.entity.GiftHistory;
import com.e101.nift.gift.model.dto.request.SendGiftDto;
import com.e101.nift.gifticon.entity.Gifticon;
import com.e101.nift.gifticon.repository.GifticonRepository;
import com.e101.nift.secondhand.entity.Article;
import com.e101.nift.secondhand.entity.ArticleHistory;
import com.e101.nift.secondhand.model.dto.response.ScrollDto;
import com.e101.nift.gift.model.dto.response.SendGiftHistoryDto;
import com.e101.nift.gift.repository.GiftHistoryRepository;
import com.e101.nift.secondhand.repository.ArticleHistoryRepository;
import com.e101.nift.secondhand.repository.ArticleRepository;
import com.e101.nift.user.entity.User;
import com.e101.nift.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@RequiredArgsConstructor
@Service
public class GiftHistoryServiceImpl implements GiftHistoryService {

    private final GiftHistoryRepository giftHistoryRepository;
    private final GifticonRepository gifticonRepository;
    private final UserRepository userRepository;
    private final ArticleRepository articleRepository;
    private final ArticleHistoryRepository articleHistoryRepository;

    @Override
    public ScrollDto<SendGiftHistoryDto> getSendGiftHistories(Long senderId, Pageable pageable) {
        Page<GiftHistory> historiesPage = giftHistoryRepository.findByFromUserId_UserId(senderId, pageable);

        List<SendGiftHistoryDto> content = historiesPage.stream().map(history -> {
            Gifticon gifticon = gifticonRepository.findByGifticonId(history.getGifticon().getGifticonId())
                    .orElseThrow(() -> new RuntimeException("기프티콘 정보를 찾을 수 없습니다."));

            User recipient = userRepository.findByUserId(history.getToUserId().getUserId())
                    .orElseThrow(() -> new RuntimeException("받는 사람 정보를 찾을 수 없습니다."));

            return new SendGiftHistoryDto(
                    history.getGiftHistoryId(),
                    gifticon.getGifticonTitle(),
                    gifticon.getImageUrl(),
                    recipient.getNickName(),
                    history.getCreatedAt()
            );
        }).toList();

        return new ScrollDto<>(content, historiesPage.hasNext());
    }

    @Override
    public void sendGiftHistory(User user, SendGiftDto request) {
        Gifticon gifticon;

        // 1. 마이페이지에서 선물 한 경우
        if ("gifticon".equals(request.getType())){
            // gifticonId로 바로 조회
            gifticon = gifticonRepository.findByGifticonId(request.getGifticonId())
                    .orElseThrow(() -> new IllegalArgumentException("기프티콘이 존재하지 않습니다."));
        } else if ("article".equals(request.getType())){
            // 2. 중고거래 상품에서 선물 한 경우
            // gifticonId -> articleId로 활용
            Article article = articleRepository.findByArticleId(request.getGifticonId())
                    .orElseThrow(() -> new IllegalArgumentException("중고 거래 상품이 존재하지 않습니다."));

            gifticon = article.getGifticon();

            // 거래 이력 저장
            ArticleHistory articleHistory = ArticleHistory.builder()
                    .articleId(article.getArticleId())
                    .userId(user.getUserId())
                    .historyType((short) 1) // 구매 = 1
                    .createdAt(LocalDateTime.now())
                    .build();
            articleHistoryRepository.save(articleHistory);

            // article.is_sold = true로 변환 / 판매 처리
            article.setSold(true);
            articleRepository.save(article);
        } else {
            throw new IllegalArgumentException("지원하지 않는 선물 타입입니다: "+request.getType());
        }

        // 선물 기록 저장
        GiftHistory giftHistory = GiftHistory.builder()
                .fromUserId(user)
                .toUserKakaoId(request.getToUserKakaoId())
                .gifticon(gifticon)
                .mongoId(request.getMongoId())
                .isReceived(false)
                .createdAt(LocalDateTime.now())
                .build();
        giftHistoryRepository.save(giftHistory);
    }
}
