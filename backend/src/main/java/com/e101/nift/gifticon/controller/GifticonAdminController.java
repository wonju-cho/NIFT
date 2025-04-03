package com.e101.nift.gifticon.controller;

import com.e101.nift.gifticon.model.request.CreateGifticonDto;
import com.e101.nift.gifticon.service.GifticonService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin/gifticons")
@RequiredArgsConstructor
public class GifticonAdminController {

    private final GifticonService gifticonService;

    @Operation(summary = "기프티콘 정보 추가", description = "기프티콘(NFT)에 대한 정보를 DB에 입력")
    @PostMapping
    public ResponseEntity<CreateGifticonDto> createGifticon(@RequestBody CreateGifticonDto gifticonDto){

        gifticonService.createGifticon(gifticonDto);

        return ResponseEntity.ok(gifticonDto);
    }
}

