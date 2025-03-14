"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "../../../component/LoadingSpinner"; 

const KakaoCallback = () => {
  const router = useRouter();

  useEffect(() => {
    const getKakaoToken = async () => {
      const code = new URL(window.location.href).searchParams.get("code");
      if (!code) return;

      try {
        // 🔹 1. 카카오 OAuth API를 통해 access_token 요청
        const response = await fetch("https://kauth.kakao.com/oauth/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            grant_type: "authorization_code",
            client_id: process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY,
            redirect_uri: process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI,
            code,
          }),
        });

        const data = await response.json();
        console.log("카카오 토큰:", data);

        if (!data.access_token) {
          throw new Error("카카오 액세스 토큰을 가져오지 못했습니다.");
        }

        localStorage.setItem("kakao_access_token", data.access_token);

        // 🔹 2. Next.js API (`/api/kakao`)로 access_token 전송
        const backendResponse = await fetch("/api/kakao", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ accessToken: data.access_token }),
        });

        const userInfo = await backendResponse.json();
        console.log("백엔드 응답 확인:", userInfo);

        router.push("/");
      } catch (error) {
        console.error("카카오 로그인 실패:", error);
      }
    };

    getKakaoToken();
  }, [router]);

  return <LoadingSpinner />;
};

export default KakaoCallback;
