package com.e101.nift.user.service;

import com.e101.nift.user.model.dto.response.UserInfoDto;

public interface UserService {
    UserInfoDto updateNickname(Long kakaoId, String nickname);  // 닉네임 변경
    UserInfoDto updateWalletAddress(Long kakaoId, String walletAddress); // 지갑 주소 변경
    void deleteUser(String accessToken);
    String getKakaoId(String accessToken);
}
