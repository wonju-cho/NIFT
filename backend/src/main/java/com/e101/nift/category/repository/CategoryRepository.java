package com.e101.nift.category.repository;

import com.e101.nift.category.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    Category findCategoryByCategoryId(Long categoryId);
}
