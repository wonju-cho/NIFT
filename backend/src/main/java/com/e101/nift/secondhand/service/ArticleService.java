package com.e101.nift.secondhand.service;

import com.e101.nift.secondhand.model.dto.response.ArticleListDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ArticleService {
    Page<ArticleListDto> getArticleList(String sort, List<Long> categories, Pageable pageable, Long userId, Integer minPrice, Integer maxPrice);
}
