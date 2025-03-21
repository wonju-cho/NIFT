package com.e101.nift.product.service;


import com.e101.nift.product.model.dto.request.ProductLikeDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

public interface LikeService {
    void addLike(Long userId, Long ProductId);
    void removeLike(Long userId, Long ProductId);
    Page<ProductLikeDTO> getLikedProducts(Long userId, Pageable pageable);
}
