package com.e101.nift.product.controller;

import com.e101.nift.product.model.dto.response.ProductListDto;
import com.e101.nift.product.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;

    @GetMapping("/secondhand/product")
    public ResponseEntity<Page<ProductListDto>> getProducts(
            @RequestParam(name = "sort", defaultValue = "newest") String sort,  // 정렬 기준
            @RequestParam(name = "category", required = false) List<Long> categories,  // 카테고리 필터링
            @RequestParam(name = "page", defaultValue = "0") int page,  // 기본 페이지 번호
            @RequestParam(name = "size", defaultValue = "10") int size,  // 페이지 크기
            @RequestParam(name = "userId", required = false) Long userId  // 로그인한 사용자 ID (좋아요 여부 확인)
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ProductListDto> products = productService.getProductList(sort, categories, pageable, userId);
        return ResponseEntity.ok(products);
    }

}
