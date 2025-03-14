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

import java.util.ArrayList;
import java.util.List;
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
            String kakaoId = jsonResponse.get("id").asText();
            String nickname = jsonResponse.get("kakao_account").get("profile").get("nickname").asText();

            JsonNode profileNode = jsonResponse.path("kakao_account").path("profile"); // `path()` 사용하여 null 방지
            // 프로필 이미지 가져오기 (기본 이미지 처리 포함)
            String profileImg;
            if (profileNode.has("profile_image_url")) {
                boolean isDefaultImage = profileNode.has("is_default_image") && profileNode.get("is_default_image").asBoolean();

                profileImg = isDefaultImage
//                      ? "https://media.istockphoto.com/id/1427748072/ko/%EC%82%AC%EC%A7%84/%ED%81%AC%EB%A6%AC%EC%8A%A4%EB%A7%88%EC%8A%A4%EC%97%90-%EC%A0%84%ED%86%B5%EC%A0%81%EC%9D%B8-%EC%82%B0%ED%83%80-%ED%81%B4%EB%A1%9C%EC%8A%A4%EC%9D%98-%EC%B4%88%EC%83%81%ED%99%94.jpg?s=612x612&w=0&k=20&c=gKsociI3Ls7ivHnQF-71HVSMb3jgPmKzdORUY4YIauM="  // ✅ 기본 프로필 이미지 URL
                        ? "https://postfiles.pstatic.net/20140606_111/sjinwon2_1402052862659ofnU1_PNG/130917_224626.png?type=w1"
                        : profileNode.get("profile_image_url").asText(); // ✅ 사용자 프로필 이미지
            } else {
//                profileImg = "https://media.istockphoto.com/id/1427748072/ko/%EC%82%AC%EC%A7%84/%ED%81%AC%EB%A6%AC%EC%8A%A4%EB%A7%88%EC%8A%A4%EC%97%90-%EC%A0%84%ED%86%B5%EC%A0%81%EC%9D%B8-%EC%82%B0%ED%83%80-%ED%81%B4%EB%A1%9C%EC%8A%A4%EC%9D%98-%EC%B4%88%EC%83%81%ED%99%94.jpg?s=612x612&w=0&k=20&c=gKsociI3Ls7ivHnQF-71HVSMb3jgPmKzdORUY4YIauM="; // ✅ 필드가 아예 없을 경우 기본 이미지 사용
                  profileImg = "https://postfiles.pstatic.net/20140606_111/sjinwon2_1402052862659ofnU1_PNG/130917_224626.png?type=w1";

            }

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
