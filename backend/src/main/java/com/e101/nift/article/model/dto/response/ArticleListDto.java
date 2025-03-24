package com.e101.nift.article.model.dto.response;

import com.e101.nift.article.entity.Article;
import lombok.Builder;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
@Builder
public class ArticleListDto {
    private final Long articleId;
    private final Long categoryId;
    private final String categoryName;
    private final String brandName;
    private final String title;
    private final String description;
    private final Integer currentPrice;
    private final Integer originalPrice;
    private final Integer discountRate;
    private final String imageUrl;
    private final Integer countLikes;
    private final Integer viewCnt;
    private final LocalDateTime createdAt;
    private final boolean isLiked;

    public static ArticleListDto from(Article article, boolean isLiked) {
        int originalPrice = article.getCurrentPrice() + 300; // 임시: 원래 가격이 현재 가격보다 300원 비쌈
        int discountRate = calculateDiscountRate(originalPrice, article.getCurrentPrice());

        return ArticleListDto.builder()
                .articleId(article.getArticleId())
                .brandName(article.getBrand().getBrandName())
                .categoryId(article.getCategory().getCategoryId())
                .categoryName(article.getCategory().getCategoryName())
                .title(article.getTitle())
                .description(article.getDescription())
                .currentPrice(article.getCurrentPrice())
                .originalPrice(originalPrice)
                .discountRate(discountRate)
                .imageUrl(article.getImageUrl())
                .countLikes(article.getCountLikes())
                .viewCnt(article.getViewCnt())
                .createdAt(article.getCreatedAt())
                .isLiked(isLiked)
                .build();
    }

    private static int calculateDiscountRate(int originalPrice, int currentPrice) {
        if (originalPrice <= 0) return 0; // 원래 가격이 0 이하일 경우 할인율 0%
        return (int) ((1 - (double) currentPrice / originalPrice) * 100);
    }

}
