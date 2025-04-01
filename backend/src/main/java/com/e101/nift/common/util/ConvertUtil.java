package com.e101.nift.common.util;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;

import java.io.InputStream;
import java.math.BigInteger;
import java.net.HttpURLConnection;
import java.net.URL;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;

@Slf4j
public class ConvertUtil {
    public static LocalDateTime convertTimestampToLocalTime(BigInteger timestamp) {
        Instant instant = Instant.ofEpochSecond(timestamp.longValue());

        // 한국 시간대 설정 (부산은 한국 표준시를 따릅니다)
        ZoneId kstZone = ZoneId.of("Asia/Seoul");

        // Instant 객체를 특정 시간대의 LocalDateTime 객체로 변환
        LocalDateTime kstDateTime = LocalDateTime.ofInstant(instant, kstZone);
        return kstDateTime;
    }

    public static String convertIpfsUrl(String metadataUrl) {
        try {
            if (metadataUrl.startsWith("ipfs://")) {
                metadataUrl = "https://ipfs.io/ipfs/" + metadataUrl.substring(7);
            }

            URL url = new URL(metadataUrl);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");

            try (InputStream is = conn.getInputStream()) {
                ObjectMapper mapper = new ObjectMapper();
                JsonNode root = mapper.readTree(is);
                String ipfsImage = root.get("image").asText();

                if (ipfsImage.startsWith("ipfs://")) {
                    return "https://ipfs.io/ipfs/" + ipfsImage.substring(7);
                } else {
                    return ipfsImage;
                }
            }
        } catch (Exception e) {
            log.error("[ConvertUtil] convertIpfsUrl 에러 발생: {}", e.getMessage());
            return null;
        }
    }
}
