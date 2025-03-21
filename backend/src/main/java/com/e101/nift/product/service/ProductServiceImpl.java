package com.e101.nift.product.service;

import com.e101.nift.product.entity.Product;
import com.e101.nift.product.model.dto.response.ProductListDto;
import com.e101.nift.product.repository.LikeRepository;
import com.e101.nift.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final LikeRepository likeRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<ProductListDto> getProductList(String sort, List<Long> categories, Pageable pageable, Long userId) {
        // 정렬 기준
        Sort sortBy = switch (sort) {
            case "highest" -> Sort.by(Sort.Direction.DESC, "currentPrice"); // 높은 가격순
            case "lowest" -> Sort.by(Sort.Direction.ASC, "currentPrice"); // 낮은 가격순
            case "likes" -> Sort.by(Sort.Direction.DESC, "countLikes"); // 좋아요순
            case "views" -> Sort.by(Sort.Direction.DESC, "viewCnt"); // 조회수순
            default -> Sort.by(Sort.Direction.DESC, "createdAt"); // 최신순
        };

        // Pageable (정렬)
        Pageable sortedPageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sortBy);

        // 다중 카테고리 필터링
        Page<ProductListDto> products;
        if (categories != null && !categories.isEmpty()) {
            products = productRepository.findByCategoryIds(categories, sortedPageable)
                    .map(product -> mapProductToDto(product, userId));
        } else {
            products = productRepository.findAll(sortedPageable)
                    .map(product -> mapProductToDto(product, userId));
        }

        return products;
    }

    // 로그인 여부와 관계없이 전체 상품 반환
    // userId == null 이면 isLiked=false로 설정
    private ProductListDto mapProductToDto(Product product, Long userId) {
        boolean isLiked = (userId != null) && likeRepository.existsByProduct_ProductIdAndUser_UserId(product.getProductId(), userId);
        log.info("상품 ID: {}, userId: {}, isLiked: {}", product.getProductId(), userId, isLiked);

        return ProductListDto.from(product, isLiked);
    }
}
