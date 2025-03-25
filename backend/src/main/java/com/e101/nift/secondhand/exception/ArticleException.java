package com.e101.nift.secondhand.exception;

import lombok.Getter;

@Getter
public class ArticleException extends RuntimeException {
    private final ArticleErrorCode errorCode;

    public ArticleException(ArticleErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }
}
