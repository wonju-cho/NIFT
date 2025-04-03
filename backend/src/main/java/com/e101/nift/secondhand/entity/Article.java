package com.e101.nift.secondhand.entity;

import com.e101.nift.gifticon.entity.Gifticon;
import com.e101.nift.secondhand.model.state.SaleStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "articles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Article {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long articleId;
    
    private String title;
    private String description;
    private Long userId;
    private LocalDateTime expirationDate;
    private String imageUrl;
    private Long serialNum;

    private Integer countLikes = 0;
    private Float currentPrice;
    private LocalDateTime createdAt;
    private Integer viewCnt = 0;
    private String txHash;

    @ManyToOne
    @JoinColumn(name = "gifticon_id", nullable = false)
    private Gifticon gifticon;

    @PrePersist
    protected void onCreate() {
        if(this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SaleStatus state = SaleStatus.ON_SALE; // 기본값 : 판매 중
}
