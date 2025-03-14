package com.e101.nift.user.model.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WalletAddressDTO {
    @NotBlank(message = "지갑 주소는 필수 입력 항목입니다.")
    private String WalletAddress;
}
