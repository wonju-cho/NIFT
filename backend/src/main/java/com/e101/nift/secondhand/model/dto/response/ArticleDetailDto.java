package com.e101.nift.secondhand.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ArticleDetailDto {
    private Long articleId;
    private Long serialNum;
    private String title;
    private String description;
    private Long userId;
    private LocalDateTime expirationDate;
    private String imageUrl;
    private Integer countLikes;
    private Float currentPrice;
    private LocalDateTime createAt;
    private Integer viewCnt;

    private Float originalPrice;
    private String brandName;
    private String categoryName;
    private boolean liked;

    private String userNickName;
    private String profileImage;
}
