package com.e101.nift.product.controller;

import com.e101.nift.common.security.JwtTokenProvider;
import com.e101.nift.product.service.LikeService;
import com.e101.nift.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/secondhand-products")
@RequiredArgsConstructor
@Tag(name="Like", description="좋아요 관련 API")
public class LikeController {

    private final LikeService likeService;
    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;

    @Operation(summary="좋아요 등록", description = "로그인한 사용자가 특정 상품에 좋아요 표시")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "좋아요 등록 성공"),
            @ApiResponse(responseCode = "401", description = "유효하지 않은 토큰"),
            @ApiResponse(responseCode = "404", description = "사용자 또는 상품을 찾을 수 없음")
    })
    @PostMapping("/{product_id}/likes")
    public ResponseEntity<String> addLike(
            @PathVariable("product_id") Long productId,
            HttpServletRequest request) {

        String accessToken = request.getHeader("Authorization");

        Long userId = jwtTokenProvider.getUserFromToken(accessToken).getUserId();
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("유효하지 않은 사용자");
        }

        likeService.addLike(userId, productId);
        return ResponseEntity.ok("좋아요 등록 완료");
    }

    @Operation(summary = "좋아요 취소", description = "사용자가 특정 상품에 대해 등록한 좋아요를 취소합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "좋아요 취소 성공"),
            @ApiResponse(responseCode = "401", description = "유효하지 않은 토큰"),
            @ApiResponse(responseCode = "404", description = "사용자 또는 상품을 찾을 수 없음")
    })
    @DeleteMapping("/{product_id}/likes")
    public ResponseEntity<String> removeLike(
            @PathVariable("product_id") Long productId,
            HttpServletRequest request) {

        Long userId = jwtTokenProvider.getUserFromRequest(request).getUserId();
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("유효하지 않은 사용자");
        }

        likeService.removeLike(userId, productId);
        return ResponseEntity.ok("좋아요 취소 완료");
    }
}
