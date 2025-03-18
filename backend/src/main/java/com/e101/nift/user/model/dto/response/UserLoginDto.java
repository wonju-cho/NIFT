package com.e101.nift.user.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@AllArgsConstructor
@Builder
public class UserLoginDto {
    private String token;
    private Long userId;
}