package com.e101.nift.product.repository;

import com.e101.nift.product.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {

    // 전체 상품 조회 (정렬 + 페이징)
    Page<Product> findAll(Pageable pageable);

    // 상품 id 로 조회
    Optional<Product> findByProductId(Long productId);

    // 다중 카테고리 필터링
    @Query("SELECT p FROM Product p WHERE p.category.categoryId IN :categories")
    Page<Product> findByCategoryIds(@Param("categories") List<Long> categories, Pageable pageable);
}
