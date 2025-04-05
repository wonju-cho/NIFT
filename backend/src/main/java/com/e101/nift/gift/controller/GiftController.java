package com.e101.nift.gift.controller;


import com.e101.nift.common.security.CustomUserDetails;
import com.e101.nift.common.security.JwtTokenProvider;
import com.e101.nift.gift.model.dto.request.ReceivedGiftDto;
import com.e101.nift.gift.model.dto.request.SendGiftDto;
import com.e101.nift.gift.model.dto.response.GiftHistoryDto;
import com.e101.nift.gift.service.GiftHistoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/gift-histories")
@RequiredArgsConstructor
@Tag(name = "Gift-histories", description = "선물 관련 API")
public class GiftController {

    private final GiftHistoryService giftHistoryService;
    private final JwtTokenProvider jwtTokenProvider;

    @PostMapping("/send")
    public ResponseEntity<Void> sendGift(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody SendGiftDto request
    ) {
        // 선물 보내는 사람
        Long sender = userDetails.getUserId();
        giftHistoryService.sendGiftHistory(sender, request);
//        System.out.println("✅ 선물 보내기 완료!");

        return ResponseEntity.ok().build();
    }

    @PostMapping("/received")
    public ResponseEntity<Void> receivedGift(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody ReceivedGiftDto receivedGiftDto
    ) {
        Long receiver = userDetails.getUserId();

        giftHistoryService.receivedGiftHistory(receiver, receivedGiftDto);

        return ResponseEntity.ok().build();
    }

    @GetMapping("/received")
    @Operation(summary = "받은 선물 조회", description = "받은 선물의 카드 디자인을 포함한 조회입니다.")
    public ResponseEntity<List<GiftHistoryDto>> getReceivedGifts(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "8") int size
    ) {
        Long receiverId = userDetails.getUserId();
        List<GiftHistoryDto> receivedGifts = giftHistoryService.getAcceptedGifts(receiverId, page, size);
        return ResponseEntity.ok(receivedGifts);
    }
}
