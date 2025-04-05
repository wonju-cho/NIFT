package com.e101.nift.gift.model.dto.response;

import com.e101.nift.gift.entity.CardDesign;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Builder;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@Builder
public class GiftHistoryDto {
    private LocalDateTime createdAt;
    private String senderNickname;
    private CardDesign cardDesign;
}