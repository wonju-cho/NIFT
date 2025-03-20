package com.e101.nift.product.model.dto.response;

import com.e101.nift.product.entity.Product;
import lombok.Builder;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
@Builder
public class ProductListDto {
    private final Long productId;
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

    public static ProductListDto from(Product product, boolean isLiked) {
        int originalPrice = product.getCurrentPrice() + 300; // 임시: 원래 가격이 현재 가격보다 300원 비쌈
        int discountRate = calculateDiscountRate(originalPrice, product.getCurrentPrice());

        return ProductListDto.builder()
                .productId(product.getProductId())
                .brandName(product.getBrand().getBrandName())
                .categoryId(product.getCategory().getCategoryId())
                .categoryName(product.getCategory().getCategoryName())
                .title(product.getTitle())
                .description(product.getDescription())
                .currentPrice(product.getCurrentPrice())
                .originalPrice(originalPrice)
                .discountRate(discountRate)
                .imageUrl(product.getImageUrl())
                .countLikes(product.getCountLikes())
                .viewCnt(product.getViewCnt())
                .createdAt(product.getCreatedAt())
                .isLiked(isLiked)
                .build();
    }

    private static int calculateDiscountRate(int originalPrice, int currentPrice) {
        if (originalPrice <= 0) return 0; // 원래 가격이 0 이하일 경우 할인율 0%
        return (int) ((1 - (double) currentPrice / originalPrice) * 100);
    }

}
