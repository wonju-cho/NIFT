package com.e101.nift.secondhand.controller;

import com.e101.nift.common.security.CustomUserDetails;
import com.e101.nift.secondhand.model.dto.request.TxHashDTO;
import com.e101.nift.secondhand.service.ContractService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/secondhand-articles")
@RequiredArgsConstructor
@Tag(name="Contract", description="거래(smart contract) 관련 API")
public class ContractController {
    private final ContractService contractService;

    @Operation(
            summary = "중고 물품 구매 계약 기록",
            description = "articleId에 해당하는 중고 물품에 대해 구매 계약을 기록합니다."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "계약 생성 성공"),
            @ApiResponse(responseCode = "404", description = "해당 게시글을 찾을 수 없음"),
            @ApiResponse(responseCode = "500", description = "서버 내부 오류")
    })
    @PostMapping("/{articleId}/purchase")
    public ResponseEntity<?> createContract(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Parameter(name = "articleId", description = "거래할 게시글 ID", example = "1")
            @PathVariable("articleId") Long articleId,
            @RequestBody TxHashDTO hashDTO
        ) {
        contractService.addArticleHistory(articleId, hashDTO.getTxHash(), userDetails.getUserId());

        return ResponseEntity.noContent().build();
    }
}
