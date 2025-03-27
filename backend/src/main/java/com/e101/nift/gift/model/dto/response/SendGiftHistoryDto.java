package com.e101.nift.gift.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SendGiftHistoryDto {
    private Long giftHistoryId;
    private String gifticonTitle;
    private String imageUrl;
    private String toNickName;
    private LocalDateTime sendDate;
}
