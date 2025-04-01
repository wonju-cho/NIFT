"use client";

import { Suspense } from "react";
import KakaoRedirectPage from "./KakaoRedirectPage";

export default function Page() {
  return (
    <Suspense fallback={<div>카카오 로그인 중입니다...</div>}>
      <KakaoRedirectPage />
    </Suspense>
  );
}
