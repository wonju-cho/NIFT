package com.e101.nift.secondhand.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SaleHistoryDto {
    private Long articleId;
    private String title;
    private String imageUrl;
    private Float currentPrice;

    // 판매되기 전에는 null 입니다.
    private String buyerNickName;
    private LocalDateTime saleDate;

}