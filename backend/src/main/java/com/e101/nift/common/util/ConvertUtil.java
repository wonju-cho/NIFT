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
        String[] gateways = {
                "https://ipfs.io/ipfs/",
                "https://cloudflare-ipfs.com/ipfs/",
                "https://gateway.pinata.cloud/ipfs/",
                "https://ipfs.infura.io/ipfs/"
        };

        try {
            String cid = null;
            if (metadataUrl.startsWith("ipfs://")) {
                cid = metadataUrl.substring(7);
            } else if (metadataUrl.contains("/ipfs/")) {
                cid = metadataUrl.substring(metadataUrl.lastIndexOf("/ipfs/") + 6);
            }

            if (cid == null) {
                log.error("[ConvertUtil] CID 추출 실패: {}", metadataUrl);
                return null;
            }

            for (String gateway : gateways) {
                try {
                    String fullUrl = gateway + cid;
                    URL url = new URL(fullUrl);
                    HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                    conn.setConnectTimeout(5000);
                    conn.setReadTimeout(5000);
                    conn.setRequestMethod("GET");

                    try (InputStream is = conn.getInputStream()) {
                        ObjectMapper mapper = new ObjectMapper();
                        JsonNode root = mapper.readTree(is);
                        String ipfsImage = root.get("image").asText();

                        if (ipfsImage.startsWith("ipfs://")) {
                            return gateway + ipfsImage.substring(7);
                        } else {
                            return ipfsImage;
                        }
                    }
                } catch (Exception inner) {
                    log.warn("[ConvertUtil] {} 게이트웨이 실패: {}", gateway, inner.getMessage());
                }
            }
        } catch (Exception e) {
            log.error("[ConvertUtil] convertIpfsUrl 전체 실패: {}", e.getMessage());
        }

        return null;
    }
}
