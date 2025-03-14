package com.e101.nift.user.model.state;

import lombok.Getter;

@Getter
public class KakaoApiState {
    private Long kakaoId;
    private String profileImgSrc;

    public KakaoApiState(Long kakaoId, String profileImgSrc) {
        this.kakaoId = kakaoId;
        this.profileImgSrc = profileImgSrc;
    }
}
