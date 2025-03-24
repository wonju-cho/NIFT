import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Noto_Sans} from "next/font/google";
import { LoadingProvider } from "@/components/LoadingContext"

const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],  // 원하는 weight만 추가
  variable: "--font-noto",        // (옵션) Tailwind 연동용 변수명
})

export const metadata: Metadata = {
  title: "NFT 기프티콘 중고거래 사이트",
  description: "안전하고 투명한 NFT 기반 기프티콘 중고거래 플랫폼",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" className={notoSans.variable}>
      <body className={notoSans.className}>
        <LoadingProvider>
          {children}
        </LoadingProvider>
      </body>
    </html>
  )
}



import './globals.css'
