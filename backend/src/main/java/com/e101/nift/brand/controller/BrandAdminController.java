package com.e101.nift.brand.controller;

import com.e101.nift.brand.entity.Brand;
import com.e101.nift.brand.model.response.BrandDto;
import com.e101.nift.brand.repository.BrandRepository;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/brands")
@RequiredArgsConstructor
public class BrandAdminController {

    private final BrandRepository brandRepository;

    @Operation(summary = "브랜드 목록 추가", description = "브랜드 목록 추가하기")
    @PostMapping
    public ResponseEntity<BrandDto> insertBrands(@RequestBody BrandDto brandDto) {
        Brand brand = new Brand();
        brand.setBrandName(brandDto.getBrandName());

        brandRepository.save(brand);

        return ResponseEntity.ok().build();
    }

}
