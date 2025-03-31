package com.e101.nift.used.repository;

import com.e101.nift.used.entity.UsedHistory;
import com.e101.nift.user.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UsedHistoryRepository extends JpaRepository<UsedHistory, Long> {

    @EntityGraph(attributePaths = {"gifticon", "gifticon.brand"})
    Page<UsedHistory> findByUserId(User user, Pageable pageable);
}
