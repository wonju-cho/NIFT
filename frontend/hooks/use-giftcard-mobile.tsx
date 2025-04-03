"use client"

import { useState, useEffect } from "react"

export function useGiftCardMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // 초기 화면 크기 확인
    checkIfMobile()

    // 화면 크기 변경 시 확인
    window.addEventListener("resize", checkIfMobile)

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  function checkIfMobile() {
    setIsMobile(window.innerWidth < 768)
  }

  return isMobile
}

