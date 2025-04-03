package com.e101.nift.secondhand.exception;

import lombok.Getter;

@Getter
public class GiftHistoryException extends RuntimeException {
    private final GiftHistoryErrorCode errorCode;

    public GiftHistoryException(GiftHistoryErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }
}
