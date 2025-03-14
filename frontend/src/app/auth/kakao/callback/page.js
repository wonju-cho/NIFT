"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { sendKakaoTokenToBackend } from "@/app/api/kakao";
import LoadingSpinner from "@/app/component/LoadingSpinner";

const KakaoCallback = () => {
  const router = useRouter();

  useEffect(() => {
    const getKakaoToken = async () => {
      const code = new URL(window.location.href).searchParams.get("code");
      if (!code) return;

      try {
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
        localStorage.setItem("kakao_access_token", data.access_token);

        // 백엔드로 토큰 보내기
        const userInfo = await sendKakaoTokenToBackend(data.access_token);
        console.log("백엔드 응답 확인 : ", userInfo);
        
        router.push("/");
      } catch (error) {
        console.error("카카오 로그인 실패:", error);
      }
    };

    getKakaoToken();
  }, [router]);

  return <LoadingSpinner />
};

export default KakaoCallback;
