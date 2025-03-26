package com.e101.nift.secondhand.model.dto.request;

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
    private Float currentPrice;
    private String imageUrl;
    private Long serialNum;
    private LocalDateTime expirationDate;
    private Long gifticonId;

}
