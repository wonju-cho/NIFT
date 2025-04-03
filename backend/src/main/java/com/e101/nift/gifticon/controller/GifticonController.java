package com.e101.nift.gifticon.controller;

import com.e101.nift.gifticon.model.response.GifticonDetailDto;
import com.e101.nift.gifticon.service.GifticonService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/gifticons")
@RequiredArgsConstructor
public class GifticonController {

    private final GifticonService gifticonService;

    @GetMapping("/{id}")
    public ResponseEntity<GifticonDetailDto> getGifticonById(@PathVariable("id") Long id){
        GifticonDetailDto dto = gifticonService.getGifticonDetail(id);
        return ResponseEntity.ok(dto);
    }
}
