package com.e101.nift.article.model.dto.request;

import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDateTime;

@Slf4j
@Getter
@Setter
public class PostArticleDto {

    private String title;
    private String description;
    private String author;
    private Float currentPrice;
    private Integer imageUrl;
    private LocalDateTime createdAt;
    private Long serialNum;
    private LocalDateTime expirationDate;
    private Long gifticonId;

}
