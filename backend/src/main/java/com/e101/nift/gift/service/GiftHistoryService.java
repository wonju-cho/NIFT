package com.e101.nift.gift.service;

import com.e101.nift.secondhand.model.dto.response.ScrollDto;
import com.e101.nift.gift.model.dto.response.SendGiftHistoryDto;
import org.springframework.data.domain.Pageable;

public interface GiftHistoryService {
    ScrollDto<SendGiftHistoryDto> getSendGiftHistories(Long userId, Pageable pageable);
}
