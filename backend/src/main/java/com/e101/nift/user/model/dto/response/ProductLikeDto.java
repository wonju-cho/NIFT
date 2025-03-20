package com.e101.nift.user.model.dto.response;

import com.e101.nift.user.model.dto.request.ProductLikeDTO;
import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductLikeDto {
    private int totalPage;
    private List<ProductLikeDTO> likes;
}