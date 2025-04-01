package com.e101.nift.gifticon.entity;

import com.e101.nift.brand.entity.Brand;
import com.e101.nift.category.entity.Category;
import com.e101.nift.secondhand.entity.Article;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "gifticons")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Gifticon {
    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long gifticonId;
    
    private String gifticonTitle;
    private String description;
    private Float price;
    private String imageUrl;
    private String metadataUrl;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;
    
    @ManyToOne
    @JoinColumn(name = "brand_id", nullable = false)
    private Brand brand;

    @OneToMany(mappedBy = "gifticon", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Article> articles_id;
}