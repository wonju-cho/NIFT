"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { sendKakaoTokenToBackend } from "../api/kakao"; // 네가 만든 함수 위치에 맞게 import 경로 수정

export default function KakaoRedirectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tokenFetched, setTokenFetched] = useState(false);

  useEffect(() => {
    const code = searchParams.get("code");
    if (code && !tokenFetched) {
      getKakaoToken(code);
      setTokenFetched(true); // 중복 방지
    }
  }, [searchParams, tokenFetched]);

  const getKakaoToken = async (code: string) => {
    try {
      const res = await fetch("https://kauth.kakao.com/oauth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          client_id: process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY!,
          redirect_uri: process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI!,
          code: code,
        }),
      });

      const data = await res.json();
      // console.log("카카오 토큰:", data);

      if (data.access_token) {
        const backendResponse = await sendKakaoTokenToBackend(data.access_token);
        // console.log("백엔드 응답 확인:", backendResponse);

        // 토큰을 로컬 스토리지 등에 저장하고 페이지 이동
        if (backendResponse?.token) {
          localStorage.setItem("nift-token", backendResponse.token);
          router.push("/"); // 로그인 성공 시 홈으로 이동
        } else {
          throw new Error("백엔드 로그인 실패");
        }
      } else {
        throw new Error("카카오 액세스 토큰을 가져오지 못했습니다.");
      }
    } catch (error) {
      console.error("카카오 로그인 실패:", error);
    }
  };

  return <div className="p-4">카카오 로그인 처리 중입니다...</div>;
}
