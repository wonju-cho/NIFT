package com.e101.nift.user.controller;

import com.e101.nift.user.entity.User;
import com.e101.nift.user.model.dto.NicknameDTO;
import com.e101.nift.user.model.dto.UserResponseDto;
import com.e101.nift.user.model.dto.WalletAddressDTO;
import com.e101.nift.user.service.KakaoAuthService;
import com.e101.nift.user.service.UserServiceImpl;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserServiceImpl userServiceImpl;
    private final KakaoAuthService kakaoAuthService;

    @PatchMapping("/nickname")
    public ResponseEntity<Void> updateNickname(HttpServletRequest request,
                                               @RequestBody @Valid NicknameDTO nicknameDTO){
        String accessToken = request.getHeader("Authorization");

        if (accessToken == null || !accessToken.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); // 토큰이 없거나 잘못됨
        }

        // "Bearer " 부분 제거하여 순수 accessToken만 추출
        accessToken = accessToken.substring(7);

        User user = kakaoAuthService.getKakaoUserInfo(accessToken);
        userServiceImpl.updateNickname(user.getKakaoId(), nicknameDTO.getNickname());

        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/wallet")
    public ResponseEntity<Void> updateWalletAddress(HttpServletRequest request,
                                                    @RequestBody @Valid WalletAddressDTO walletAddressDTO) {
        String accessToken = request.getHeader("Authorization");

        if (accessToken == null || !accessToken.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); // 토큰이 없거나 잘못됨
        }

        // "Bearer " 부분 제거하여 순수 accessToken만 추출
        accessToken = accessToken.substring(7);

        User user = kakaoAuthService.getKakaoUserInfo(accessToken);
        userServiceImpl.updateWalletAddress(user.getKakaoId(), walletAddressDTO.getWalletAddress());

        return ResponseEntity.noContent().build();
    }
    @GetMapping("/me")
    public ResponseEntity<UserResponseDto> getMyInfo(HttpServletRequest request) {
        String accessToken = request.getHeader("Authorization");

        if (accessToken == null || !accessToken.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); // 토큰이 없거나 잘못됨
        }

        // "Bearer " 부분 제거하여 순수 accessToken만 추출
        accessToken = accessToken.substring(7);

        UserResponseDto userResponse = userServiceImpl.getUserInfo(accessToken);
        return ResponseEntity.ok(userResponse);
    }

}
