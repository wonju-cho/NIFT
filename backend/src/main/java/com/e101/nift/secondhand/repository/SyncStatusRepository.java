package com.e101.nift.secondhand.repository;

import com.e101.nift.secondhand.entity.SyncStatus;
import com.e101.nift.secondhand.model.state.SyncType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

public interface SyncStatusRepository extends JpaRepository<SyncStatus, Long> {
    Optional<SyncStatus> findSyncStatusBySyncType(SyncType type);

    @Modifying
    @Transactional
    @Query("UPDATE SyncStatus s SET s.lastSyncedBlock = :lastSyncedBlock, s.updatedAt = :updatedAt WHERE s.syncType = :syncType")
    void updateByLastSyncedBlock(@Param("lastSyncedBlock") Long lastSyncedBlock,
                                 @Param("updatedAt") LocalDateTime updatedAt,
                                 @Param("syncType") SyncType syncType);
}
