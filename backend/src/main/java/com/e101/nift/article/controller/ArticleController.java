package com.e101.nift.article.controller;

import com.e101.nift.article.model.dto.request.PostArticleDto;
import com.e101.nift.article.model.dto.response.ProductListDto;
import com.e101.nift.article.service.ArticleService;
import com.e101.nift.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ArticleController {
    private static final Logger log = LoggerFactory.getLogger(ArticleController.class);
    private final ArticleService productService;
    private final UserService userService;

    @Operation(summary = "판매 게시글 조회", description = "기프티콘을 판매하는 게시글을 조회합니다.")
    @GetMapping("/secondhand/article")
    public ResponseEntity<Page<ProductListDto>> getArticles(
            @RequestParam(name = "sort", defaultValue = "newest") String sort,  // 정렬 기준
            @RequestParam(name = "category", required = false) List<Long> categories,  // 카테고리 필터링
            @RequestParam(name = "page", defaultValue = "0") int page,  // 기본 페이지 번호
            @RequestParam(name = "size", defaultValue = "10") int size,  // 페이지 크기
            HttpServletRequest request
    ) {
        String accessToken = request.getHeader("Authorization");
        Long userId = null;

        if (accessToken != null && accessToken.startsWith("Bearer ")) {
            accessToken = accessToken.substring(7);
            try {
                userId = userService.findByAccessToken(accessToken).getUserId();
            } catch (Exception e) {
                log.warn("Invalid access token: {}", e.getMessage());
            }
        }

        Pageable pageable = PageRequest.of(page, size);
        Page<ProductListDto> products = productService.getProductList(sort, categories, pageable, userId);
        return ResponseEntity.ok(products);
    }

    @Operation(summary = "게시글 쓰기", description = "기프티콘 판매 게시글을 작성합니다.")
    @PostMapping("/secondhand-articles")
    public ResponseEntity<Void> PostArticles(
            HttpServletRequest request,
            PostArticleDto postArticleDto
    ) {


        return null;
    }


}
