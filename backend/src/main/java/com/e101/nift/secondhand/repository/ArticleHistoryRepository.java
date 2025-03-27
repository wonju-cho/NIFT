package com.e101.nift.secondhand.repository;

import com.e101.nift.secondhand.entity.ArticleHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ArticleHistoryRepository extends JpaRepository<ArticleHistory, Long> {
    Page<ArticleHistory> findByUserIdAndHistoryType(Long userId, short historyType, Pageable pageable);
    Optional<ArticleHistory> findByArticleId(Long articleId);
}
