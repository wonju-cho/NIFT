package com.e101.nift.used.controller;

import com.e101.nift.common.security.CustomUserDetails;
import com.e101.nift.used.model.dto.response.UsedHistoryDto;
import com.e101.nift.used.service.UsedHistoryService;
import com.e101.nift.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Page;

@RestController
@RequestMapping("/users/gifticons")
@RequiredArgsConstructor
public class UsedHistoryController {

    private final UsedHistoryService usedHistoryService;

    @GetMapping("/used")
    public Page<UsedHistoryDto> getUsedGifticons(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PageableDefault(size = 6, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        if (userDetails == null) {
            throw new IllegalArgumentException("인증된 사용자 정보가 없습니다.");
        }

        return usedHistoryService.getUsedGifticons(userDetails.getUserId(), pageable);
    }
}
