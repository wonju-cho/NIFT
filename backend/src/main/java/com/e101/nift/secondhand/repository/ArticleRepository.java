package com.e101.nift.secondhand.repository;

import com.e101.nift.secondhand.entity.Article;
import com.e101.nift.secondhand.model.state.SaleStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

import java.util.Optional;

public interface ArticleRepository extends JpaRepository<Article, Long> {

    // 전체 상품 조회 (정렬 + 페이징)
    Page<Article> findAll(Pageable pageable);

    // 상품 id 로 조회
    Optional<Article> findByArticleId(Long articleId);

    // 다중 카테고리 필터링
    @Query("SELECT p FROM Article p WHERE p.gifticon.category.categoryId IN :categories "+
            "AND p.state = :state")
    Page<Article> findByCategoryIds(@Param("categories") List<Long> categories,
                                    @Param("state") SaleStatus state,
                                    Pageable pageable);

    // 가격 범위 필터링
    @Query("SELECT p FROM Article p " +
            "WHERE (:minPrice IS NULL OR p.currentPrice >= :minPrice) " +
            "AND (:maxPrice IS NULL OR p.currentPrice <= :maxPrice) " +
            "AND p.state = :state")
    Page<Article> findByPriceRange(@Param("minPrice") Integer minPrice,
                                   @Param("maxPrice") Integer maxPrice,
                                   @Param("state") SaleStatus state,
                                   Pageable pageable);

    // 카테고리와 가격 조건 모두 적용
    @Query("SELECT p FROM Article p " +
            "WHERE p.gifticon.category IN :categories " +
            "AND (:minPrice IS NULL OR p.currentPrice >= :minPrice) " +
            "AND (:maxPrice IS NULL OR p.currentPrice <= :maxPrice) " +
            "AND p.state = :state")
    Page<Article> findByCategoryAndPriceRange(@Param("categories") List<Long> categories,
                                              @Param("minPrice") Integer minPrice,
                                              @Param("maxPrice") Integer maxPrice,
                                              @Param("state") SaleStatus state,
                                              Pageable pageable);

    // 중고 기프티콘의 상세 정보 조회
    @Query("SELECT a FROM Article a " +
            "JOIN FETCH a.gifticon g " +
            "JOIN FETCH g.brand b " +
            "JOIN FETCH g.category c " +
            "WHERE a.articleId = :articleId")
    Optional<Article> findByIdWithGifticonBrandCategory(@Param("articleId") Long articleId);

    // 중고 기프티콘 판매자의 ID와 페이지로 조회
    Page<Article> findByUserId(Long userId, Pageable pageable);

    Optional<Article> findArticleBySerialNum(Long serialNum);

    Optional<Article> findArticleByTxHash(String txHash);
}
