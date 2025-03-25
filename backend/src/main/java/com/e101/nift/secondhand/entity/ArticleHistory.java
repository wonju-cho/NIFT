package com.e101.nift.secondhand.entity;

import com.e101.nift.secondhand.entity.Article;
import com.e101.nift.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "article_histories")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ArticleHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long historyId;
    
    private LocalDateTime createdAt;

    private Long userId;
    private Long articleId;
    private short contractType;
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}