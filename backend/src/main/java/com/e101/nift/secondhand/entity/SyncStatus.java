package com.e101.nift.secondhand.entity;

import com.e101.nift.secondhand.model.state.SyncType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "sync_status")
@Getter
@Setter
public class SyncStatus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "sync_type")
    @Enumerated(EnumType.STRING)
    private SyncType syncType;

    @Column(name = "last_synced_block")
    private Long lastSyncedBlock;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
