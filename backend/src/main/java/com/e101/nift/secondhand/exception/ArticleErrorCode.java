package com.e101.nift.secondhand.exception;

import com.e101.nift.common.exception.BaseErrorCode;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum ArticleErrorCode implements BaseErrorCode {
    ARTICLE_NOT_FOUND(HttpStatus.NOT_FOUND, "게시글을 찾을 수 없습니다.");

    private final HttpStatus status;
    private final String message;
}
