package com.e101.nift.product.controller;

import com.e101.nift.common.security.JwtTokenProvider;
import com.e101.nift.product.model.dto.response.ProductListDto;
import com.e101.nift.product.service.ProductService;
import com.e101.nift.user.entity.User;
import com.e101.nift.user.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/secondhand-products")
public class ProductController {
    private static final Logger log = LoggerFactory.getLogger(ProductController.class);
    private final ProductService productService;
    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;

    @GetMapping
    public ResponseEntity<Page<ProductListDto>> getProducts(
            @RequestParam(name = "sort", defaultValue = "newest") String sort,  // 정렬 기준
            @RequestParam(name = "category", required = false) List<Long> categories,  // 카테고리 필터링
            @RequestParam(name = "page", defaultValue = "0") int page,  // 기본 페이지 번호
            @RequestParam(name = "size", defaultValue = "10") int size,  // 페이지 크기
            HttpServletRequest request
    ) {
        Long userId = null;

        try {
            User user = jwtTokenProvider.getUserFromRequest(request);
            userId = user.getUserId();
        } catch (UsernameNotFoundException e){
            log.warn("유효하지 않은 토큰입니다: {}", e.getMessage());
        }

        Pageable pageable = PageRequest.of(page, size);
        Page<ProductListDto> products = productService.getProductList(sort, categories, pageable, userId);
        return ResponseEntity.ok(products);
    }

}
