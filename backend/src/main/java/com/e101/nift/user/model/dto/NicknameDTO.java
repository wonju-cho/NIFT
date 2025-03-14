package com.e101.nift.user.model.dto;

import jakarta.validation.Valid;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NicknameDTO {
    private String nickname;
}
