package com.e101.nift.secondhand.model.dto.response;

import com.e101.nift.secondhand.model.dto.request.ArticleLikeDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class ArticleLikeDto {
    private int totalPage;
    private List<ArticleLikeDTO> likes;
}
