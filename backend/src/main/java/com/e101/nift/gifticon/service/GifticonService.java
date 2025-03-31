package com.e101.nift.gifticon.service;

import com.e101.nift.gifticon.model.request.CreateGifticonDto;
import com.e101.nift.gifticon.model.response.GifticonDetailDto;

public interface GifticonService {
    GifticonDetailDto getGifticonDetail(Long gifticonId);
    void createGifticon(CreateGifticonDto gifticonDto);
}
