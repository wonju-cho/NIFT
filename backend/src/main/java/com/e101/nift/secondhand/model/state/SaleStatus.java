package com.e101.nift.secondhand.model.state;

public enum SaleStatus {
    ON_SALE,        // 판매 중
    IN_PROGRESS,    // 거래 시도 중
    SOLD,           // 판매 완료
    EXPIRED,        // 유효기간 만료
    DELETED         // 삭제된 게시글
}
