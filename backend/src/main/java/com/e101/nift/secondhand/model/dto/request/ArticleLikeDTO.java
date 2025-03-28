package com.e101.nift.secondhand.model.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ArticleLikeDTO {
    private Long articleId;
    private String title;
    private int countLikes;
    private String imageUrl;
    private Float currentPrice;
}
