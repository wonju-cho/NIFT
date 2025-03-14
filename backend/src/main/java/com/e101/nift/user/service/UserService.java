package com.e101.nift.user.service;

import com.e101.nift.user.model.dto.response.UserInfoDto;

public interface UserService {
    UserInfoDto updateNickname(String kakaoId, String nickname);  // 닉네임 변경
    UserInfoDto updateWalletAddress(String kakaoId, String walletAddress); // 지갑 주소 변경

    String getKakaoId(String accessToken);
}
