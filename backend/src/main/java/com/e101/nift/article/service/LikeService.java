package com.e101.nift.article.service;


import com.e101.nift.article.model.dto.request.ArticleLikeDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface LikeService {
    void addLike(Long userId, Long ArticleId);
    void removeLike(Long userId, Long ArticleId);
    Page<ArticleLikeDTO> getLikedArticles(Long userId, Pageable pageable);
}
