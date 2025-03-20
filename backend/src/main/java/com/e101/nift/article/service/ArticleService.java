package com.e101.nift.article.service;

import com.e101.nift.article.model.dto.response.ProductListDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ArticleService {
    Page<ProductListDto> getProductList(String sort, List<Long> categories, Pageable pageable, Long userId);
}
