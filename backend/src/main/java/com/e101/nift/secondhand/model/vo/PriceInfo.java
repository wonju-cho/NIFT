package com.e101.nift.secondhand.model.vo;

import lombok.Getter;

@Getter
public class PriceInfo {

    private final float originalPrice;
    private final float currentPrice;

    public PriceInfo(float originalPrice, float currentPrice) {
        this.originalPrice = originalPrice;
        this.currentPrice = currentPrice;
    }

    public int calculateDiscountRate() {
        if (originalPrice <= 0) return 0;
        return (int) ((1 - currentPrice / originalPrice) * 100);
    }
}
