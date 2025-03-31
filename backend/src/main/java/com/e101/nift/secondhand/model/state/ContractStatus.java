package com.e101.nift.secondhand.model.state;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ContractStatus {
    SUCCESS("SUCCESS"),
    FAILED("FAILED"),
    PENDING("PENDING");

    private final String type;
}
