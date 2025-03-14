package com.e101.nift.user.service;

import com.e101.nift.common.exception.CustomException;
import com.e101.nift.common.exception.ErrorCode;
import com.e101.nift.user.entity.User;
import com.e101.nift.user.model.dto.response.UserInfoDto;
import com.e101.nift.user.model.state.KakaoApiUrl;
import com.e101.nift.user.repository.UserRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;


@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class UserServiceImpl implements UserService{

    private final UserRepository userRepository;
    private final WalletService walletService;
    private final ObjectMapper objectMapper;

    private final KakaoAuthService kakaoAuthService;
    private final RestTemplateBuilder restTemplateBuilder;

    @Override
    @Transactional
    public UserInfoDto updateNickname(Long kakaoId, String nickname) {
        User user = userRepository.findByKakaoId(kakaoId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setNickName(nickname);
        userRepository.save(user);
        return null;
    }

    @Override
    public UserInfoDto updateWalletAddress(Long kakaoId, String walletAddress) {
        User user = userRepository.findByKakaoId(kakaoId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setWalletAddress(walletAddress);
        userRepository.save(user);
        return null;
    }

    @Override
    public void deleteUser(String accessToken) {
        unlinkedKakaoInfo(accessToken);
    }

    @Override
    public String getKakaoId(String accessToken) {
        return "";
    }

    @Transactional(readOnly = true)
    public UserInfoDto getUserInfo(String accessToken) {
        log.info("🔍 [UserService] 사용자 정보 조회 요청: accessToken={}", accessToken);

        // ✅ 1. 카카오 API에서 프로필 이미지 가져오기
        String profileImg = kakaoAuthService.getKakaoUserInfo(accessToken).getProfileImage();

        // ✅ 2. DB에서 유저 조회 (닉네임 & 지갑 주소)
        User user = getUserFromDb(accessToken);

        // ✅ 3. SSAFY 네트워크에서 실시간 지갑 잔액 조회
        BigDecimal balance = walletService.getWalletBalance(user.getWalletAddress());

        log.info("✅ [UserService] 사용자 정보 조회 성공: userId={}, nickname={}, walletAddress={}, balance={}",
                user.getUserId(), user.getNickName(), user.getWalletAddress(), balance);

        // ✅ 4. 모든 정보를 DTO에 담아 반환
        return UserInfoDto.builder()
                .profileImage(profileImg)
                .nickname(user.getNickName())
                .walletAddress(user.getWalletAddress())
                .balance(balance)
                .message("본인 정보를 조회했습니다.")
                .build();
    }


    private boolean unlinkedKakaoInfo(String accessToken) {
        log.info("🔍 [UserService] Kakao Unlink API 요청");

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + accessToken);
            headers.setContentType(MediaType.APPLICATION_JSON);

            Long kakaoId = kakaoAuthService.getKakaoUserInfo(accessToken).getKakaoId();

            String requestBody = "target_id_type=user_id&target_id=" + kakaoId;

            HttpEntity<String> requestEntity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<String> response = restTemplateBuilder.build()
                    .exchange(
                            KakaoApiUrl.KAKAO_USER_UNLINK.getUrl(),
                            HttpMethod.POST,
                            requestEntity,
                            String.class
                    );

            if (response.getStatusCode() == HttpStatus.OK) {
                JsonNode jsonNode = objectMapper.readTree(response.getBody());
                log.info("✅ [UserService] Kakao unlink API 응답 성공: {}", jsonNode);
                long responseId = jsonNode.path("id").asLong(-1); // id가 없을 경우 -1 반환

                if(responseId == kakaoId) {
                    userRepository.findByKakaoId(kakaoId)
                            .ifPresentOrElse(userRepository::delete, () -> {
                                throw new CustomException(ErrorCode.INVALID_REQUEST);
                            });

                    return true;
                }
                else {
                    log.error("❌ [UserService] Kakao unlink API 응답 ID 불일치: 요청 ID={}, 응답 ID={}",
                            kakaoId, responseId);
                    throw new CustomException(ErrorCode.INVALID_REQUEST);
                }
            } else {
                log.error("❌ [UserService] Kakao API 호출 실패: statusCode={}", response.getStatusCode());
                throw new CustomException(ErrorCode.INVALID_REQUEST);
            }
        } catch (Exception e) {
            log.error("❌ [UserService] Kakao API 응답 파싱 실패: {}", e.getMessage(), e);
            throw new CustomException(ErrorCode.INVALID_REQUEST);
        }
    }

    // ✅ DB에서 Kakao ID로 사용자 조회
    private User getUserFromDb(String accessToken) {
        Long kakaoId = kakaoAuthService.getKakaoUserInfo(accessToken).getKakaoId();
        log.info("🔍 [UserService] DB에서 사용자 조회: kakaoId={}", kakaoId);

        return userRepository.findByKakaoId(kakaoId)
                .orElseThrow(() -> {
                    log.error("❌ [UserService] 해당 카카오 ID로 등록된 사용자를 찾을 수 없음: kakaoId={}", kakaoId);
                    return new IllegalArgumentException("해당 카카오 계정이 등록되지 않았습니다.");
                });
    }

}
