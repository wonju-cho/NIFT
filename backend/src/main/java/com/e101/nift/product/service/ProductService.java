package com.e101.nift.product.service;

import com.e101.nift.product.model.dto.response.ProductListDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ProductService {
    Page<ProductListDto> getProductList(String sort, List<Long> categories, Pageable pageable, Long userId);
}
