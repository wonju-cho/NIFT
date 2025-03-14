package com.e101.nift.user.model.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@Builder
public class UserInfoDto {

    private final String profileImage;

    private final String nickname;

    private final String walletAddress;

    private final BigDecimal balance;

    @Builder.Default
    private final String message = "본인 정보를 조회했습니다.";
}