package com.e101.nift.gift.service;

import com.e101.nift.gift.model.dto.request.SendGiftDto;
import com.e101.nift.secondhand.model.dto.response.ScrollDto;
import com.e101.nift.gift.model.dto.response.SendGiftHistoryDto;
import com.e101.nift.user.entity.User;
import org.springframework.data.domain.Pageable;

public interface GiftHistoryService {
    ScrollDto<SendGiftHistoryDto> getSendGiftHistories(Long userId, Pageable pageable);

    // 프론트에서 요청 받는 선물 기록 저장
    void sendGiftHistory(User user, SendGiftDto request);
}
