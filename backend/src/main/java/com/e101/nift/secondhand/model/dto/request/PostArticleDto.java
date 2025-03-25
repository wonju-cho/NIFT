package com.e101.nift.article.model.dto.request;

import java.time.LocalDateTime;

public class PostArticleDto {

    private String title;
    private String description;
    private String author;
    private Float currentPrice;
    private Integer categoryId;
    private LocalDateTime createdAt;
    private LocalDateTime expirationDate;
    private Long gifticonId;

    // 이걸 기프티콘id에서 받아올지, 게시글 테이블에도 저장할지?
    //private Integer brandId;
}
