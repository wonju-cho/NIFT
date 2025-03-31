package com.e101.nift.gift.controller;


import com.e101.nift.gift.entity.CardDesign;
import com.e101.nift.gift.repository.CardDesignRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/gift-histories")
public class CardDesignController {
    private final CardDesignRepository cardDesignRepository;

    // 카드 저장
    @PostMapping("/cards")
    public String saveCard(@RequestBody CardDesign cardDesign) {
        CardDesign saved = cardDesignRepository.save(cardDesign);

        log.info("🎁 Saved card design: {}", saved.getId());
        return saved.getId(); // mongo_id 반환
    }

    // 카드 조회
    @GetMapping("/cards/{id}")
    public CardDesign getCard(@PathVariable String id) {
        return cardDesignRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Card Not Found"));
    }
}
