package com.e101.nift.gifticon.model.request;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class CreateGifticonDto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long gifticonId;

    private String gifticonTitle;
    private String description;
    private Float price;
    private String imageUrl;
    private Long categoryId;
    private Long brandId;
}