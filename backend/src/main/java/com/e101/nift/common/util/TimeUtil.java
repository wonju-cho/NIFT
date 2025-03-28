package com.e101.nift.common.util;

import java.math.BigInteger;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;

public class TimeUtil {
    public static LocalDateTime convertTimestampToLocalTime(BigInteger timestamp) {
        Instant instant = Instant.ofEpochSecond(timestamp.longValue());

        // 한국 시간대 설정 (부산은 한국 표준시를 따릅니다)
        ZoneId kstZone = ZoneId.of("Asia/Seoul");

        // Instant 객체를 특정 시간대의 LocalDateTime 객체로 변환
        LocalDateTime kstDateTime = LocalDateTime.ofInstant(instant, kstZone);
        return kstDateTime;
    }
}
