package com.e101.nift.article.service;

import com.e101.nift.article.entity.Article;
import com.e101.nift.article.model.dto.response.ArticleListDto;
import com.e101.nift.article.repository.LikeRepository;
import com.e101.nift.article.repository.ArticleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ArticleServiceImpl implements ArticleService {

    private final ArticleRepository articleRepository;
    private final LikeRepository likeRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<ArticleListDto> getArticleList(String sort, List<Long> categories, Pageable pageable, Long userId, Integer minPrice, Integer maxPrice) {
        // 정렬 기준
        Sort sortBy = switch (sort) {
            case "highest" -> Sort.by(Sort.Direction.DESC, "currentPrice").and(Sort.by("articleId"));
            case "lowest" -> Sort.by(Sort.Direction.ASC, "currentPrice").and(Sort.by("articleId"));
            case "likes" -> Sort.by(Sort.Direction.DESC, "countLikes").and(Sort.by("articleId"));
            case "views" -> Sort.by(Sort.Direction.DESC, "viewCnt").and(Sort.by("articleId"));
            default -> Sort.by(Sort.Direction.DESC, "createdAt").and(Sort.by("articleId"));
        };

        // 정렬이 적용된 Pageable 생성
        Pageable sortedPageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sortBy);

        Page<ArticleListDto> articles;

        // 필터
        if (categories != null && !categories.isEmpty()) {
            // 카테고리 필터가 적용된 경우
            if (minPrice != null || maxPrice != null) {
                // 카테고리 + 가격 조건 모두 적용
                articles = articleRepository.findByCategoryAndPriceRange(categories, minPrice, maxPrice, sortedPageable)
                        .map(article -> {
                            boolean isLiked = (userId != null) &&
                                    likeRepository.existsByArticle_ArticleIdAndUser_UserId(article.getArticleId(), userId);
                            return ArticleListDto.from(article, isLiked);
                        });
            } else {
                // 카테고리만 적용
                articles = articleRepository.findByCategoryIds(categories, sortedPageable)
                        .map(article -> {
                            boolean isLiked = (userId != null) &&
                                    likeRepository.existsByArticle_ArticleIdAndUser_UserId(article.getArticleId(), userId);
                            return ArticleListDto.from(article, isLiked);
                        });
            }
        } else {
            // 카테고리 필터가 없는 경우
            if (minPrice != null || maxPrice != null) {
                // 가격 조건만 적용
                articles = articleRepository.findByPriceRange(minPrice, maxPrice, sortedPageable)
                        .map(article -> {
                            boolean isLiked = (userId != null) &&
                                    likeRepository.existsByArticle_ArticleIdAndUser_UserId(article.getArticleId(), userId);
                            return ArticleListDto.from(article, isLiked);
                        });
            } else {
                // 아무 필터도 없는 경우 전체 조회
                articles = articleRepository.findAll(sortedPageable)
                        .map(article -> {
                            boolean isLiked = (userId != null) &&
                                    likeRepository.existsByArticle_ArticleIdAndUser_UserId(article.getArticleId(), userId);
                            return ArticleListDto.from(article, isLiked);
                        });
            }
        }
        return articles;
    }

    // 로그인 여부와 관계없이 전체 상품 반환
    // userId == null 이면 isLiked=false로 설정
    private ArticleListDto mapArticleToDto(Article article, Long userId) {
        boolean isLiked = (userId != null) && likeRepository.existsByArticle_ArticleIdAndUser_UserId(article.getArticleId(), userId);
        log.info("상품 ID: {}, userId: {}, isLiked: {}", article.getArticleId(), userId, isLiked);

        return ArticleListDto.from(article, isLiked);
    }
}