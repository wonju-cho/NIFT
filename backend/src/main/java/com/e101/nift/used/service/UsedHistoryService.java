package com.e101.nift.used.service;

import com.e101.nift.used.model.dto.response.UsedHistoryDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface UsedHistoryService {
    Page<UsedHistoryDto> getUsedGifticons(Long userId, Pageable pageable);
}
