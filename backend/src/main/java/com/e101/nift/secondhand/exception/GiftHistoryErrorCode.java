package com.e101.nift.secondhand.exception;

import com.e101.nift.common.exception.BaseErrorCode;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum GiftHistoryErrorCode implements BaseErrorCode {
    ARTICLE_NOT_FOUND(HttpStatus.NOT_FOUND, "게시글을 찾을 수 없습니다."),
    TRANSACTION_EXCEPTION(HttpStatus.BAD_GATEWAY, "Tx Receipt 조회 실패"),
    USER_MISMATCH(HttpStatus.UNPROCESSABLE_ENTITY, "트랜잭션 실행자와 로그인 사용자가 다릅니다."),
    CANNOT_FIND_BY_ADDRESS(HttpStatus.UNPROCESSABLE_ENTITY, "지갑 주소로 사용자를 찾을 수 없습니다."),
    UNPROCESSABLE_TRANSACTION(HttpStatus.UNPROCESSABLE_ENTITY, "실패한 트랜잭션입니다. 정상적인 트랜잭션을 전송해주세요");

    private final HttpStatus status;
    private final String message;
}
