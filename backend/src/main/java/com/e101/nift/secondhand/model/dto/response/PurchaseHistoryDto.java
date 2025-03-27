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
public class PurchaseHistoryDto {
    private Long articleHistoryId;
    private String title;
    private String imageUrl;
    private Float price;
    private String sellerNickname;
    private LocalDateTime purchaseDate;
}
