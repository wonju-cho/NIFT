package com.e101.nift.product.model.dto.response;

import com.e101.nift.product.model.dto.request.ProductLikeDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class ProductLikeDto {
    private int totalPage;
    private List<ProductLikeDTO> likes;
}
