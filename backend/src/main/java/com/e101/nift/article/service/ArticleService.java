package com.e101.nift.article.service;

import com.e101.nift.article.model.dto.request.PostArticleDto;
import com.e101.nift.article.model.dto.response.ArticleListDto;
import com.e101.nift.user.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface ArticleService {
    Page<ArticleListDto> getArticleList(String sort, List<Long> categories, Pageable pageable, Long userId, Integer minPrice, Integer maxPrice);
    void createArticle(PostArticleDto postArticleDto, User user);

}
