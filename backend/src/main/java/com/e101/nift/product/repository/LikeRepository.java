package com.e101.nift.product.repository;

import com.e101.nift.product.entity.Like;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LikeRepository extends JpaRepository<Like, Long> {
    boolean existsByProduct_ProductIdAndUser_UserId(Long productId, Long userId);
}
