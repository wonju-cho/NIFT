package com.e101.nift.article.entity;

import com.e101.nift.user.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "article_histories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ArticleHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long articleHistoryId;
    private String createdAt;
    private int historyType;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne
    @JoinColumn(name = "articles_id", nullable = false)
    private Article article;
}