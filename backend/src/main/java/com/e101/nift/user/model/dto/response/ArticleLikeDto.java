package com.e101.nift.user.model.dto.response;

import com.e101.nift.user.model.dto.request.ArticleLikeDTO;
import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ArticleLikeDto {
    private int totalPage;
    private List<ArticleLikeDTO> likes;
}