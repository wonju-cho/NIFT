package com.e101.nift.gifticon.service;

import com.e101.nift.gifticon.model.request.CreateGifticonDto;
import com.e101.nift.gifticon.model.response.GifticonDetailDto;

import java.util.List;

public interface GifticonService {
    GifticonDetailDto getGifticonDetail(Long gifticonId);
    void createGifticon(CreateGifticonDto gifticonDto);
    List<GifticonDetailDto> getAllGifticons();
}
