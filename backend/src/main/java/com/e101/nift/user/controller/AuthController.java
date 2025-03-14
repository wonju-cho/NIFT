package com.e101.nift.user.controller;

<<<<<<< HEAD
import com.e101.nift.user.model.dto.UserSignupRequestDto;
=======
import com.e101.nift.user.entity.User;
import com.e101.nift.user.model.dto.request.NicknameDTO;
import com.e101.nift.user.service.KakaoAuthService;
import lombok.RequiredArgsConstructor;
>>>>>>> 406ced2d1fb6b88b4234573762974b09701046ec
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
<<<<<<< HEAD
import org.springframework.web.bind.annotation.*;

@Slf4j
=======
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@Slf4j
@RequiredArgsConstructor
>>>>>>> 406ced2d1fb6b88b4234573762974b09701046ec
@RestController
@RequestMapping("/auth")
public class AuthController {

<<<<<<< HEAD
=======
    private final KakaoAuthService kakaoAuthService;

    @PostMapping("/login")
    public ResponseEntity<User> kakaoLogin(@RequestBody Map<String, String> request) {
        String accessToken = request.get("accessToken");

        log.info("accessToken: {}", accessToken);

        User user = kakaoAuthService.getKakaoUserInfo(accessToken);

        if (user == null) {
            return ResponseEntity.badRequest().build();
        }

        log.info("카카오 로그인 완료: ID={}, 닉네임={}", user.getKakaoId(), user.getNickName());

        return ResponseEntity.ok(user);
    }

>>>>>>> 406ced2d1fb6b88b4234573762974b09701046ec
    @Operation(summary = "회원가입", description = "새로운 사용자를 등록합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "회원가입 성공"),
            @ApiResponse(responseCode = "400", description = "입력값 검증 실패",
                    content = @Content(schema = @Schema(implementation = String.class)))
    })
    @PostMapping("/signup")
<<<<<<< HEAD
    public ResponseEntity<String> signup(@Valid @RequestBody UserSignupRequestDto requestDto) {
=======
    public ResponseEntity<String> signup(@Valid @RequestBody NicknameDTO.UserSignupDto requestDto) {
>>>>>>> 406ced2d1fb6b88b4234573762974b09701046ec
        return ResponseEntity.ok("회원가입 성공");
    }
}
