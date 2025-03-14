package com.e101.nift.user.model.state;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum KakaoApiUrl {
    KAKAO_USER_ME("https://kapi.kakao.com/v2/user/me"),
    KAKAO_USER_UNLINK("https://kapi.kakao.com/v1/user/unlink");

    private final String url;
}
