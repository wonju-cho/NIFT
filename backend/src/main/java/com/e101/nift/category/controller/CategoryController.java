package com.e101.nift.category.controller;

import com.e101.nift.category.entity.Category;
import com.e101.nift.category.model.CategoryDto;
import com.e101.nift.category.repository.CategoryRepository;
import com.e101.nift.gifticon.model.request.CreateGifticonDto;
import com.e101.nift.gifticon.model.response.GifticonDetailDto;
import com.e101.nift.gifticon.service.GifticonService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final GifticonService gifticonService;
    private final CategoryRepository categoryRepository;

    @Operation(summary = "카테고리 목록 가져오기", description = "카테고리 목록 가져오기")
    @GetMapping("/categories")
    public ResponseEntity<List<CategoryDto>> getAllCategories() {
        List<Category> categories = categoryRepository.findAll();

        List<CategoryDto> result = categories.stream()
                .map(c -> new CategoryDto(c.getCategoryId(), c.getCategoryName()))
                .toList();

        return ResponseEntity.ok(result);
    }

}
