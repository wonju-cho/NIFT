package com.e101.nift.article.service;

import com.e101.nift.article.entity.Article;
import com.e101.nift.article.model.dto.response.ArticleListDto;
import com.e101.nift.article.repository.LikeRepository;
import com.e101.nift.article.repository.ArticleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ArticleServiceImpl implements ArticleService {

    private final ArticleRepository articleRepository;
    private final LikeRepository likeRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<ArticleListDto> getArticleList(String sort, List<Long> categories, Pageable pageable, Long userId) {
        // 정렬 기준
        Sort sortBy = switch (sort) {
            case "highest" -> Sort.by(Sort.Direction.DESC, "currentPrice"); // 높은 가격순
            case "lowest" -> Sort.by(Sort.Direction.ASC, "currentPrice"); // 낮은 가격순
            case "likes" -> Sort.by(Sort.Direction.DESC, "countLikes"); // 좋아요순
            case "views" -> Sort.by(Sort.Direction.DESC, "viewCnt"); // 조회수순
            default -> Sort.by(Sort.Direction.DESC, "createdAt"); // 최신순
        };

        // Pageable (정렬)
        Pageable sortedPageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sortBy);

        // 다중 카테고리 필터링
        Page<ArticleListDto> articles;
        if (categories != null && !categories.isEmpty()) {
            articles = articleRepository.findByCategoryIds(categories, sortedPageable)
                    .map(article -> mapArticleToDto(article, userId));
        } else {
            articles = articleRepository.findAll(sortedPageable)
                    .map(article -> mapArticleToDto(article, userId));
        }

        return articles;
    }

    // 로그인 여부와 관계없이 전체 상품 반환
    // userId == null 이면 isLiked=false로 설정
    private ArticleListDto mapArticleToDto(Article article, Long userId) {
        boolean isLiked = (userId != null) && likeRepository.existsByArticle_ArticleIdAndUser_UserId(article.getArticleId(), userId);
        return ArticleListDto.from(article, isLiked);
    }
}
