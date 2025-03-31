package com.e101.nift.gifticon.controller;

import com.e101.nift.gifticon.model.request.CreateGifticonDto;
import com.e101.nift.gifticon.model.response.GifticonDetailDto;
import com.e101.nift.gifticon.service.GifticonService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/gifticons")
@RequiredArgsConstructor
public class GifticonController {

    private final GifticonService gifticonService;

    @GetMapping("/{id}")
    public ResponseEntity<GifticonDetailDto> getGifticonById(@PathVariable Long id){
        GifticonDetailDto dto = gifticonService.getGifticonDetail(id);
        return ResponseEntity.ok(dto);
    }

    @Operation(summary = "기프티콘 정보 추가", description = "기프티콘(NFT)에 대한 정보를 DB에 입력")
    @PostMapping
    public ResponseEntity<CreateGifticonDto> createGifticon(@RequestBody CreateGifticonDto gifticonDto){

        gifticonService.createGifticon(gifticonDto);

        return ResponseEntity.ok(gifticonDto);
    }
}
