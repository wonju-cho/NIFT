package com.e101.nift.user.service;

import com.e101.nift.common.exception.CustomException;
import com.e101.nift.common.exception.ErrorCode;
import com.e101.nift.user.entity.User;
import com.e101.nift.user.model.dto.response.UserInfoDto;
import com.e101.nift.user.model.state.KakaoApiState;
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


@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class UserServiceImpl implements UserService{

    private final UserRepository userRepository;
    private final WalletService walletService;
    private final ObjectMapper objectMapper;


    // ✅ Kakao API URL
    private static final String KAKAO_API_URL = "https://kapi.kakao.com/v2/user/me";
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
    public void deleteUser(Long kakaoId) {

    }

    @Override
    public String getKakaoId(String accessToken) {
        return "";
    }

    @Transactional(readOnly = true)
    public UserInfoDto getUserInfo(String accessToken) {
        log.info("🔍 [UserService] 사용자 정보 조회 요청: accessToken={}", accessToken);

        // ✅ 1. 카카오 API에서 프로필 이미지 가져오기
        KakaoApiState kakaoApiState = fetchKakaoInfo(accessToken, "profile_image");

        // ✅ 2. DB에서 유저 조회 (닉네임 & 지갑 주소)
        User user = getUserFromDb(accessToken);

        // ✅ 3. SSAFY 네트워크에서 실시간 지갑 잔액 조회
        BigDecimal balance = walletService.getWalletBalance(user.getWalletAddress());

        log.info("✅ [UserService] 사용자 정보 조회 성공: userId={}, nickname={}, walletAddress={}, balance={}",
                user.getUserId(), user.getNickName(), user.getWalletAddress(), balance);

        // ✅ 4. 모든 정보를 DTO에 담아 반환
        return UserInfoDto.builder()
                .profileImage(kakaoApiState.getProfileImgSrc())
                .nickname(user.getNickName())
                .walletAddress(user.getWalletAddress())
                .balance(balance)
                .message("본인 정보를 조회했습니다.")
                .build();
    }

    // ✅ 공통된 Kakao API 요청을 처리하는 메서드 (Jackson `ObjectMapper` 사용)
    private KakaoApiState fetchKakaoInfo(String accessToken, String key) {
        log.info("🔍 [UserService] Kakao API 요청: key={}", key);

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + accessToken);
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<String> entity = new HttpEntity<>(headers);
            ResponseEntity<String> response = restTemplateBuilder.build().exchange(KAKAO_API_URL, HttpMethod.GET, entity, String.class);

            if (response.getStatusCode() == HttpStatus.OK) {
                JsonNode jsonNode = objectMapper.readTree(response.getBody());
                log.info("✅ [UserService] Kakao API 응답 성공");

                // ✅ "id" 가져오기
                Long kakaoId = jsonNode.get("id").asLong();
                String profileImg = jsonNode.get("properties").get(key).asText();
                return new KakaoApiState(kakaoId, profileImg);
            } else {
                log.error("❌ [UserService] Kakao API 호출 실패: statusCode={}", response.getStatusCode());
                throw new CustomException(ErrorCode.INVALID_REQUEST);
//                return key.equals("profile_image") ? "https://default-profile-image.com/default.jpg" : "N/A";
            }
        } catch (Exception e) {
            log.error("❌ [UserService] Kakao API 응답 파싱 실패: {}", e.getMessage(), e);
//            return key.equals("profile_image") ? "https://default-profile-image.com/default.jpg" : "N/A";
            throw new CustomException(ErrorCode.INVALID_REQUEST);
        }
    }

    // ✅ DB에서 Kakao ID로 사용자 조회
    private User getUserFromDb(String accessToken) {
        Long kakaoId = fetchKakaoInfo(accessToken, "id").getKakaoId(); // ✅ Kakao ID 추출
        log.info("🔍 [UserService] DB에서 사용자 조회: kakaoId={}", kakaoId);

        return userRepository.findByKakaoId(kakaoId)
                .orElseThrow(() -> {
                    log.error("❌ [UserService] 해당 카카오 ID로 등록된 사용자를 찾을 수 없음: kakaoId={}", kakaoId);
                    return new IllegalArgumentException("해당 카카오 계정이 등록되지 않았습니다.");
                });
    }

}
