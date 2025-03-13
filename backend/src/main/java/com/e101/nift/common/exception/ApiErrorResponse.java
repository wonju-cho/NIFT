package com.e101.nift.common.exception;

import lombok.Getter;

@Getter
public class ApiErrorResponse extends ErrorResponse {
    public ApiErrorResponse(ErrorCode errorCode) {
        super(errorCode); // ✅ 부모 클래스의 생성자 호출
    }
}
