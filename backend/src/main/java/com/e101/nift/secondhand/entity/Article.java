package com.e101.nift.secondhand.entity;

import com.e101.nift.gifticon.entity.Gifticon;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "articles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Article {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long articleId;
    
    private String title;
    private String description;
    private Long userId;
    private LocalDateTime expirationDate;
    private String imageUrl;
    private Long SerialNum;

    private Integer countLikes = 0;
    private Float currentPrice;
    private LocalDateTime createdAt;
    private Integer viewCnt = 0;

    @ManyToOne
    @JoinColumn(name = "gifticon_id", nullable = false)
    private Gifticon gifticon;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}