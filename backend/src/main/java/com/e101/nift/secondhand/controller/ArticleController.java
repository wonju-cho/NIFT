package com.e101.nift.secondhand.controller;

import com.e101.nift.common.security.JwtTokenProvider;
import com.e101.nift.secondhand.model.dto.request.PostArticleDto;
import com.e101.nift.secondhand.model.dto.response.ArticleListDto;
import com.e101.nift.secondhand.service.ArticleService;
import com.e101.nift.secondhand.service.ArticleServiceImpl;
import com.e101.nift.user.entity.User;
import com.e101.nift.user.service.UserServiceImpl;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/secondhand-articles")
public class ArticleController {
    private static final Logger log = LoggerFactory.getLogger(ArticleController.class);
    private final ArticleServiceImpl articleService;
    private final JwtTokenProvider jwtTokenProvider;

    @GetMapping
    @Operation(summary = "판매 게시글 조회", description = "기프티콘을 판매하는 게시글을 조회합니다.")
    public ResponseEntity<Page<ArticleListDto>> getArticles(
            @RequestParam(name = "sort", defaultValue = "newest") String sort,  // 정렬 기준
            @RequestParam(name = "category", required = false) List<Long> categories,  // 카테고리 필터링
            @RequestParam(name = "page", defaultValue = "1") int page,  // 기본 페이지 번호
            @RequestParam(name = "size", defaultValue = "10") int size,  // 페이지 크기
            @RequestParam(name = "minPrice", required = false) Integer minPrice,    // 최소 가격
            @RequestParam(name = "maxPrice", required = false) Integer maxPrice,     // 최대 가격
            HttpServletRequest request
    ) {
        Long userId = null;

        try {
            User user = jwtTokenProvider.getUserFromRequest(request);
            userId = user.getUserId();
        } catch (UsernameNotFoundException e){
            log.warn("유효하지 않은 토큰입니다: {}", e.getMessage());
        }

        Pageable pageable = PageRequest.of(page-1, size);
        Page<ArticleListDto> articles = articleService.getArticleList(sort, categories, pageable, userId, minPrice, maxPrice);
        return ResponseEntity.ok(articles);
    }

    @Operation(summary = "게시글 쓰기", description = "기프티콘 판매 게시글을 작성합니다.")
    @PostMapping
    public ResponseEntity<?> PostArticles(
            HttpServletRequest request,
            @RequestBody PostArticleDto postArticleDto
    ) {
        Long userId = jwtTokenProvider.getUserFromRequest(request).getUserId();
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("유효하지 않은 사용자");
        }

        articleService.createArticle(postArticleDto, userId);
        return ResponseEntity.status(201).build();
    }
}
