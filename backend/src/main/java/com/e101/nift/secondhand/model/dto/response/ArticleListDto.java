package com.e101.nift.secondhand.model.dto.response;

import com.e101.nift.secondhand.entity.Article;
import com.e101.nift.secondhand.model.vo.PriceInfo;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.Optional;

@Getter
@Builder
public class ArticleListDto {

    private final Long articleId;
    private final Long categoryId;
    private final String categoryName;
    private final String brandName;
    private final String title;
    private final String description;
    private final PriceInfo priceInfo;
    private final String imageUrl;
    private final Integer countLikes;
    private final Integer viewCnt;
    private final LocalDateTime createdAt;
    private final boolean isLiked;

    // 👇 할인율은 VO에서 계산하고 여기서 Getter만 제공
    public int getDiscountRate() {
        return priceInfo.calculateDiscountRate();
    }

    public static ArticleListDto from(Article article, boolean isLiked) {
        Float current = article.getCurrentPrice();
        Float original = Optional.ofNullable(article.getGifticon().getPrice()).orElse(0f);

        PriceInfo priceInfo = new PriceInfo(original, current);

        return ArticleListDto.builder()
                .articleId(article.getArticleId())
                .brandName(article.getGifticon().getBrand().getBrandName())
                .categoryId(article.getGifticon().getCategory().getCategoryId())
                .categoryName(article.getGifticon().getCategory().getCategoryName())
                .title(article.getTitle())
                .description(article.getDescription())
                .priceInfo(priceInfo)
                .imageUrl(article.getImageUrl())
                .countLikes(article.getCountLikes())
                .viewCnt(article.getViewCnt())
                .createdAt(article.getCreatedAt())
                .isLiked(isLiked)
                .build();
    }
}
