package com.e101.nift.secondhand.model.state;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public enum SyncType {
    REAL_TIME("REAL_TIME");
    private final String type;
}
