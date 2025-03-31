package com.e101.nift.gifticon.model.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class GifticonDetailDto {
    private Long gifticonId;
    private String gifticonTitle;
    private String description;
    private String imageUrl;
    private Float price;
    private String brandName;
}
