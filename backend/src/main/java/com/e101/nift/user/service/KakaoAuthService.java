package com.e101.nift.user.service;

import com.e101.nift.user.entity.User;
import com.e101.nift.user.repository.UserRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class KakaoAuthService {
    private static final String USER_INFO_URL = "https://kapi.kakao.com/v2/user/me";

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final UserRepository userRepository;

    public User getKakaoUserInfo(String accessToken) {
        try {
            // 카카오 API 호출하여 사용자 정보 가져오기
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + accessToken);
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            HttpEntity<String> request = new HttpEntity<>(headers);
            ResponseEntity<String> response = restTemplate.exchange(USER_INFO_URL, HttpMethod.GET, request, String.class);

            JsonNode jsonResponse = objectMapper.readTree(response.getBody());
            Long kakaoId = jsonResponse.get("id").asLong();
            String nickname = jsonResponse.get("kakao_account").get("profile").get("nickname").asText();

            JsonNode profileNode = jsonResponse.path("kakao_account").path("profile"); // `path()` 사용하여 null 방지
            // 프로필 이미지 가져오기 (기본 이미지 처리 포함)
            String profileImg = profileNode.get("profile_image_url").asText();

            log.info("profileImg : " + profileImg);

            // DB에서 사용자 조회
            Optional<User> existingUser = userRepository.findByKakaoId(kakaoId);

            if (existingUser.isPresent()) {
                log.info("기존 사용자 로그인: ID={}, 닉네임={}", kakaoId, nickname);
                return existingUser.get();
            }

            // 새 사용자 저장
            User newUser = new User();
            newUser.setKakaoId(kakaoId);
            newUser.setNickName(nickname);
            newUser.setProfileImage(profileImg);
            newUser.setWalletAddress(null); // 최초에는 NULL

            userRepository.save(newUser);

            log.info("새로운 사용자 등록: ID={}, 닉네임={}", kakaoId, nickname);
            return newUser;

        } catch (Exception e) {
            log.error("카카오 로그인 실패", e);
            return null;
        }
    }
}
