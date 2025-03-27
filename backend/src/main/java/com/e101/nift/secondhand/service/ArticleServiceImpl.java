package com.e101.nift.secondhand.service;

import com.e101.nift.gifticon.entity.Gifticon;
import com.e101.nift.secondhand.entity.Article;
import com.e101.nift.secondhand.model.dto.response.ArticleDetailDto;
import com.e101.nift.secondhand.model.dto.request.PostArticleDto;
import com.e101.nift.secondhand.model.dto.response.ArticleListDto;
import com.e101.nift.secondhand.repository.LikeRepository;
import com.e101.nift.secondhand.repository.ArticleRepository;
import com.e101.nift.gifticon.repository.GifticonRepository;
import com.e101.nift.user.entity.User;
import com.e101.nift.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.time.format.DateTimeFormatter;


@Slf4j
@Service
@RequiredArgsConstructor
public class ArticleServiceImpl implements ArticleService {

    private final ArticleRepository articleRepository;
    private final LikeRepository likeRepository;
    private final GifticonRepository gifticonRepository;
    private final UserRepository userRepository;

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

    // 중고 기프티콘의 상세 정보 조회
    @Override
    public ArticleDetailDto getArticleDetail(Long articleId, Long userId) {
        Article article = articleRepository.findByIdWithGifticonBrandCategory(articleId)
                .orElseThrow(() -> new RuntimeException("상품이 조회되지 않습니다."));

        Gifticon gifticon = article.getGifticon();
        boolean isLiked = false;
        if (userId != null) {
            isLiked = likeRepository.existsByArticle_ArticleIdAndUser_UserId(articleId, userId);
        }

        User user = userRepository.findByUserId(article.getUserId())
                .orElseThrow(() -> new RuntimeException("판매자 정보가 조회되지 않습니다."));

        return new ArticleDetailDto(
                article.getArticleId(),
                article.getSerialNum(),
                article.getTitle(),
                article.getDescription(),
                article.getUserId(),
                article.getExpirationDate(),
                article.getImageUrl(),
                article.getCountLikes(),
                article.getCurrentPrice(),
                article.getCreatedAt(),
                article.getViewCnt(),
                gifticon.getPrice(),
                gifticon.getBrand().getBrandName(),
                gifticon.getCategory().getCategoryName(),
                isLiked,
                user.getNickName(),
                user.getProfileImage()
        );
    }

    @Override
    public void createArticle(PostArticleDto postArticleDto, Long userId) {
        Gifticon gifticon = gifticonRepository.findById(postArticleDto.getGifticonId())
                .orElseThrow(() -> new IllegalArgumentException("기프티콘이 존재하지 않습니다."));

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");

        Article article = new Article();
        article.setTitle(postArticleDto.getTitle());
        article.setDescription(postArticleDto.getDescription());
        article.setUserId(userId);
        article.setCurrentPrice(postArticleDto.getCurrentPrice());
        article.setExpirationDate(LocalDateTime.parse(postArticleDto.getExpirationDate(), formatter));
        article.setSerialNum(postArticleDto.getSerialNum());
        article.setCountLikes(0);
        article.setViewCnt(0);
        article.setImageUrl(postArticleDto.getImageUrl());
        article.setGifticon(gifticon);

        articleRepository.save(article);
    }

    @Override
    public void deleteArticle(Long id) {
        articleRepository.deleteById(id);
    }
}