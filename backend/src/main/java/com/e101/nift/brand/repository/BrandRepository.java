package com.e101.nift.brand.repository;

import com.e101.nift.brand.entity.Brand;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BrandRepository extends JpaRepository<Brand, Long> {
    Brand findBrandByBrandId(Long brandId);
}
