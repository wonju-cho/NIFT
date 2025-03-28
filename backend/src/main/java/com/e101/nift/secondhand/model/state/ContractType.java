package com.e101.nift.secondhand.model.state;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ContractType {
    PURCHASE(Short.parseShort("1")),
    SALE(Short.parseShort("2")),
    GIFT(Short.parseShort("3"));

    private final short type;
}
