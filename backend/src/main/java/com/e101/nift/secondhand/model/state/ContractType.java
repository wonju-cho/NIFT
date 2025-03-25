package com.e101.nift.secondhand.model.state;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ContractType {
    SALE(Short.parseShort("1")),
    PURCHASE(Short.parseShort("2"));

    private final short type;
}
