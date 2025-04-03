package com.e101.nift.gift.model.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SendGiftDto {
    private Long toUserKakaoId;
    // 증고거래에서 선물 -> articleId가 담길 것
    // 마이페이지에서 선물 -> gifticonId가 담길 것
    private Long gifticonId;
    private String mongoId;

    // 중고거래에서 선물 -> article
    // 마이페이지에서 선물 -> gifticon
    private String type;
    private String txHashPurchase;
    private String txHashGift;
}
