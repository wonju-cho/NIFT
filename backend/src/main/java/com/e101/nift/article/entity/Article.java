package com.e101.nift.article.entity;

import com.e101.nift.gifticon.entity.Gifticon;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Setter;
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
    private String userId;
    private LocalDateTime expirationDate;
    private String imageUrl;

    private Integer countLikes;
    private Float currentPrice;
    private LocalDateTime createdAt;
    private Integer viewCnt;

    @ManyToOne
    @JoinColumn(name = "gifticon", nullable = false)
    private Gifticon gifticon;
}