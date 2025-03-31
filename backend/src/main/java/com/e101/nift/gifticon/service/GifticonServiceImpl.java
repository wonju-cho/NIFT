package com.e101.nift.gifticon.service;

import com.e101.nift.gifticon.entity.Gifticon;
import com.e101.nift.gifticon.model.response.GifticonDetailDto;
import com.e101.nift.gifticon.repository.GifticonRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GifticonServiceImpl implements GifticonService {

    private final GifticonRepository gifticonRepository;


    @Override
    public GifticonDetailDto getGifticonDetail(Long gifticonId) {
        Gifticon gifticon = gifticonRepository.findById(gifticonId)
                .orElseThrow(() -> new EntityNotFoundException("조회되는 기프티콘이 없습니다"));

        return new GifticonDetailDto(
                gifticon.getGifticonId(),
                gifticon.getGifticonTitle(),
                gifticon.getDescription(),
                gifticon.getImageUrl(),
                gifticon.getPrice(),
                gifticon.getBrand().getBrandName()
        );
    }
}
