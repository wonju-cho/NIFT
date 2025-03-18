package com.e101.nift.user.controller;

import com.e101.nift.user.entity.User;
import com.e101.nift.user.model.dto.request.NicknameDTO;
import com.e101.nift.user.model.dto.response.UserInfoDto;
import com.e101.nift.user.model.dto.request.WalletAddressDTO;
import com.e101.nift.user.service.KakaoAuthService;
import com.e101.nift.user.service.UserService;
import com.e101.nift.user.service.UserServiceImpl;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final KakaoAuthService kakaoAuthService;
    private final UserService userService;

    @PatchMapping("/nickname")
    public ResponseEntity<Void> updateNickname(HttpServletRequest request,
                                               @RequestBody @Valid NicknameDTO nicknameDTO){
        String accessToken = request.getHeader("Authorization");

        if (accessToken == null || !accessToken.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); // 토큰이 없거나 잘못됨
        }

        // "Bearer " 부분 제거하여 순수 accessToken만 추출
        accessToken = accessToken.substring(7);

        User user = userService.findByAccessToken(accessToken);
        userService.updateNickname(user.getKakaoId(), nicknameDTO.getNickname());

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

        User user = userService.findByAccessToken(accessToken);
        userService.updateWalletAddress(user.getKakaoId(), walletAddressDTO.getWalletAddress());

        return ResponseEntity.noContent().build();
    }
    @GetMapping("/me")
    public ResponseEntity<UserInfoDto> getMyInfo(HttpServletRequest request) {
        String accessToken = request.getHeader("Authorization");

        if (accessToken == null || !accessToken.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); // 토큰이 없거나 잘못됨
        }

        // "Bearer " 부분 제거하여 순수 accessToken만 추출
        accessToken = accessToken.substring(7);

        log.info("[UserController] getMyInfo accessToken 추출: {}", accessToken);

        UserInfoDto userResponse = userService.getUserInfo(accessToken);
        return ResponseEntity.ok(userResponse);
    }

    @DeleteMapping("/me")
    public  ResponseEntity<Void> deleteUser(HttpServletRequest request) { // kakaoAccessToken 전달 받음
        String accessToken = request.getHeader("Authorization");

        if (accessToken == null || !accessToken.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); // 토큰이 없거나 잘못됨
        }

        // "Bearer " 부분 제거하여 순수 accessToken만 추출
        accessToken = accessToken.substring(7);

        userService.deleteUser(accessToken);

        return ResponseEntity.noContent().build();
    }
}
