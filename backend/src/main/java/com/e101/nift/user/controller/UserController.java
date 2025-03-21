package com.e101.nift.user.controller;

import com.e101.nift.common.security.JwtTokenProvider;
import com.e101.nift.product.model.dto.request.ProductLikeDTO;
import com.e101.nift.product.model.dto.response.ProductLikeDto;
import com.e101.nift.product.service.LikeService;
import com.e101.nift.user.entity.User;
import com.e101.nift.user.model.dto.request.NicknameDTO;
import com.e101.nift.user.model.dto.response.UserInfoDto;
import com.e101.nift.user.model.dto.request.WalletAddressDTO;
import com.e101.nift.user.service.KakaoAuthService;
import com.e101.nift.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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
    private final LikeService likeService;
    private final JwtTokenProvider jwtTokenProvider;

    @PatchMapping("/nickname")
    public ResponseEntity<Void> updateNickname(HttpServletRequest request,
                                               @RequestBody @Valid NicknameDTO nicknameDTO){
        User user = jwtTokenProvider.getUserFromRequest(request);

        userService.updateNickname(user.getKakaoId(), nicknameDTO.getNickname());

        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/wallet")
    public ResponseEntity<Void> updateWalletAddress(HttpServletRequest request,
                                                    @RequestBody @Valid WalletAddressDTO walletAddressDTO) {
        User user = jwtTokenProvider.getUserFromRequest(request);

        userService.updateWalletAddress(user.getKakaoId(), walletAddressDTO.getWalletAddress());

        return ResponseEntity.noContent().build();
    }
    @GetMapping("/me")
    public ResponseEntity<UserInfoDto> getMyInfo(HttpServletRequest request) {
        User user = jwtTokenProvider.getUserFromRequest(request);

        UserInfoDto userResponse = userService.getUserInfoByUser(user);
        return ResponseEntity.ok(userResponse);
    }

    @DeleteMapping("/me")
    public  ResponseEntity<Void> deleteUser(
            @RequestHeader("Authorization") String jwtToken,
            @RequestHeader("Kakao-Authorization") String kakaoToken
    ) {
        userService.deleteUser(jwtToken, kakaoToken);

        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "좋아요한 상품 목록 조회", description = "마이페이지의 찜한 목록에서 사용자가 좋아요한 중고거래 상품 목록을 페이징하여 가져옵니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "좋아요한 상품 목록 조회 성공",
                    content = @Content(schema = @Schema(implementation = ProductLikeDto.class))),
            @ApiResponse(responseCode = "401", description = "유효하지 않은 토큰")
    })
    @GetMapping("/likes")
    public ResponseEntity<ProductLikeDto> getLikedProducts(
            HttpServletRequest request,
            @RequestParam(name = "page", defaultValue = "0") int page) { // 기본값을 1로 변경

        Long userId = jwtTokenProvider.getUserFromRequest(request).getUserId();

        // 좋아요한 상품 목록 조회 (페이지당 6개, 기본 페이지 1부터 시작)
        Pageable pageable = PageRequest.of(page, 6);
        Page<ProductLikeDTO> likedProducts = likeService.getLikedProducts(userId, pageable);

        ProductLikeDto response = new ProductLikeDto(likedProducts.getTotalPages(), likedProducts.getContent());
        return ResponseEntity.ok(response);
    }
}
