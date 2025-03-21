package com.e101.nift.product.repository;

import com.e101.nift.product.entity.Like;
import com.e101.nift.product.entity.Product;
import com.e101.nift.user.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LikeRepository extends JpaRepository<Like, Long> {
    boolean existsByProduct_ProductIdAndUser_UserId(Long productId, Long userId);

    // 상품ID와 사용자ID로 좋아요 상품 조회
    Optional<Like> findByUserAndProduct(User user, Product product);

    // 사용자 ID, 페이지 번호로 좋아요 상품 전체 조회
    Page<Like> findByUser(User user, Pageable pageable);

    // 사용자 아이디로 좋아요 데이터 삭제
    void deleteByUser_UserId(Long userId);

}

