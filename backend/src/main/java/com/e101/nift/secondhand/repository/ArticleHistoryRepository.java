package com.e101.nift.secondhand.repository;

import com.e101.nift.secondhand.entity.ArticleHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ArticleHistoryRepository extends JpaRepository<ArticleHistory, Long> {
    Page<ArticleHistory> findByUserIdAndHistoryTypeIn(Long userId, List<Short> historyTypes, Pageable pageable);
    Optional<ArticleHistory> findByArticleId(Long articleId);
    Optional<ArticleHistory> findByTxHash(String txHash);
}
