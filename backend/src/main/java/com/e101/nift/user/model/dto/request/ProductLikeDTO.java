package com.e101.nift.user.model.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductLikeDTO {
    private String title;
    private int countLikes;
    private String imageUrl;
    private int currentPrice;
}