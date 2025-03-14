import React from "react";

const KAKAO_REST_API_KEY = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY;
const REDIRECT_URI = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI;

const KakaoLoginButton = () => {
  const kakaoLogin = () => {
    const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;
    window.location.href = kakaoURL;
  };

  return (
    <button onClick={kakaoLogin} style={{ background: "#FEE500", padding: "10px", borderRadius: "5px", border: "none" }}>
      카카오 로그인
    </button>
  );
};

export default KakaoLoginButton;
