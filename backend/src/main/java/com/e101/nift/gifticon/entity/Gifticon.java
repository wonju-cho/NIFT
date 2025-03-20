package com.e101.nift.gifticon.entity;

import com.e101.nift.article.entity.Article;
import com.e101.nift.article.entity.Brand;
import com.e101.nift.article.entity.Category;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "gifticon")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Gifticon {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long gifticon_id;
    
    private String gifticon_title;
    private String description;
    private Float price;
    private String imageUrl;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;
    
    @ManyToOne
    @JoinColumn(name = "brand_id", nullable = false)
    private Brand brand;

    @OneToMany(mappedBy = "gifticon", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Article> articles;
}