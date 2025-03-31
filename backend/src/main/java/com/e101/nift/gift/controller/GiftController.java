package com.e101.nift.gift.controller;


import com.e101.nift.common.security.JwtTokenProvider;
import com.e101.nift.gift.model.dto.request.SendGiftDto;
import com.e101.nift.gift.service.GiftHistoryService;
import com.e101.nift.user.entity.User;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/gift-histories")
@RequiredArgsConstructor
@Tag(name="Gift-histories", description="선물 관련 API")
public class GiftController {

    private final GiftHistoryService giftHistoryService;
    private final JwtTokenProvider jwtTokenProvider;

    @PostMapping("/send")
    public ResponseEntity<Void> sendGift(
            HttpServletRequest http,
            @RequestBody SendGiftDto request
    ){
        // 선물 보내는 사람
        User sender = jwtTokenProvider.getUserFromRequest(http);
        giftHistoryService.sendGiftHistory(sender, request);
//        System.out.println("✅ 선물 보내기 완료!");

        return ResponseEntity.ok().build();
    }


}
