package com.e101.nift.article.repository;

import com.e101.nift.article.entity.Article;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
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
    @Query("SELECT p FROM Article p WHERE p.category.categoryId IN :categories")
    Page<Article> findByCategoryIds(@Param("categories") List<Long> categories, Pageable pageable);

    // 가격 범위 필터링
    @Query("SELECT p FROM Article p " +
            "WHERE (:minPrice IS NULL OR p.currentPrice >= :minPrice) " +
            "AND (:maxPrice IS NULL OR p.currentPrice <= :maxPrice)")
    Page<Article> findByPriceRange(@Param("minPrice") Integer minPrice,
                                   @Param("maxPrice") Integer maxPrice,
                                   Pageable pageable);

    // 카테고리와 가격 조건 모두 적용
    @Query("SELECT p FROM Article p " +
            "WHERE p.category.categoryId IN :categories " +
            "AND (:minPrice IS NULL OR p.currentPrice >= :minPrice) " +
            "AND (:maxPrice IS NULL OR p.currentPrice <= :maxPrice)")
    Page<Article> findByCategoryAndPriceRange(@Param("categories") List<Long> categories,
                                              @Param("minPrice") Integer minPrice,
                                              @Param("maxPrice") Integer maxPrice,
                                              Pageable pageable);
}
