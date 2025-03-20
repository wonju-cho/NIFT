package com.e101.nift.article.service;

import com.e101.nift.user.model.dto.request.ProductLikeDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface LikeService {
    void addLike(Long userId, Long ProductId);
    void removeLike(Long userId, Long ProductId);
    Page<ProductLikeDTO> getLikedProducts(Long userId, Pageable pageable);
}
