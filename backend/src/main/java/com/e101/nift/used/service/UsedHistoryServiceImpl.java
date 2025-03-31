package com.e101.nift.used.service;

import com.e101.nift.common.exception.CustomException;
import com.e101.nift.common.exception.ErrorCode;
import com.e101.nift.gifticon.entity.Gifticon;
import com.e101.nift.user.entity.User;
import com.e101.nift.user.repository.UserRepository;
import com.e101.nift.used.entity.UsedHistory;
import com.e101.nift.used.model.dto.response.UsedHistoryDto;
import com.e101.nift.used.repository.UsedHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UsedHistoryServiceImpl implements UsedHistoryService {

    private final UsedHistoryRepository usedHistoryRepository;
    private final UserRepository userRepository;

    @Override
    public Page<UsedHistoryDto> getUsedGifticons(Long userId, Pageable pageable) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        return usedHistoryRepository.findByUserId(user, pageable)
                .map(history -> {
                    Gifticon g = history.getGifticon();
                    return UsedHistoryDto.builder()
                            .brandName(g.getBrand().getBrandName())
                            .title(g.getGifticonTitle())
                            .imageUrl(g.getImageUrl())
                            .usedAt(history.getCreatedAt())
                            .build();
                });
    }
}
