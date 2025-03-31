"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { CardPreview } from "@/components/gift/card-preview"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Check, Copy, Home, ShoppingBag } from "lucide-react"

export default function GiftCompletePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [cardData, setCardData] = useState<any>(null)
  const [article, setArticle] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [remainingTime, setRemainingTime] = useState(60);

  // 임의의 주문번호 생성
  const orderNumber = `NIFT-${Date.now().toString().slice(-8)}`

  // 페이지 로드 시 상품 정보와 카드 데이터 가져오기
  useEffect(() => {
    try {
      // 임시 데이터 - 실제로는 API에서 가져옵니다
      const saved = localStorage.getItem(`article-data-${params.id}`);
      if (saved) setArticle(JSON.parse(saved));

      const card = localStorage.getItem(`card-data-${params.id}`);
      if (card) setCardData(JSON.parse(card));

      // 카운트다운
      const interval = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            clearInterval(interval)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      // 1분 뒤 삭제 + 메인 이동
      const timeout = setTimeout(() => {
        localStorage.removeItem(`article-data-${params.id}`);
        localStorage.removeItem(`card-data-${params.id}`);
        router.push("/");
      }, 60 * 1000);

      return () => {
        clearInterval(interval)
        clearTimeout(timeout)
      }
    } catch (error) {
      console.error("상품 정보 또는 카드 데이터를 가져오는 데 실패했습니다:", error)
    } finally {
      setIsLoading(false)
    }
  }, [params.id])

  // 주문번호 복사 기능
  const copyToClipboard = () => {
    navigator.clipboard.writeText(orderNumber).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const progressPercent = (1 - remainingTime / 60) * 100

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-gray-500">로딩 중...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-white py-12">
        <div className="container max-w-4xl">
          <div className="mb-10 text-center">
            <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-4">
              <Check className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold mb-2">주문이 완료되었습니다</h1>
            <p className="text-gray-500">
              선물 구매가 성공적으로 완료되었습니다. 받는 분의 휴대폰으로 선물이 전송되었습니다.
            </p>
          </div>

          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">주문 정보</h2>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">주문번호: {orderNumber}</span>
                  <button onClick={copyToClipboard} className="text-gray-500 hover:text-gray-700">
                    {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="relative h-24 w-24 overflow-hidden rounded-md border bg-gray-100 flex-shrink-0">
                    <Image
                      src={article.image || "/placeholder.svg"}
                      alt={article.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <h3 className="font-medium">{article.brandName}</h3>
                    <p className="text-lg font-bold leading-tight">{article.title}</p>
                    <p className="mt-2 text-sm text-gray-500 leading-relaxed">{article.description}</p>
                  </div>
                </div>

                <div className="p-4 bg-gray-100 rounded-lg">
                  <h4 className="font-medium mb-2">받는 분 정보</h4>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="font-medium">받는 분:</span> {article.profile_nickname || "수령인"}
                    </p>
                    <p>
                      <span className="font-medium">전송 완료:</span> 수신자의 휴대폰으로 선물이 전송되었습니다.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ⏳ 자동 이동 타이머 표시 */}
          <div className="mb-6">
            <div className="text-center text-sm text-gray-600 mb-2">
              ⏳ {remainingTime}초 후 메인 페이지로 이동합니다.
            </div>
            <div className="w-full bg-gray-200 h-2 rounded overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-1000"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>          

          {/* 카드 미리보기 */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">선물 카드 미리보기</h2>
              <CardPreview cardData={cardData} className="w-full max-w-[500px] mx-auto" />
            </CardContent>
          </Card>

          <div className="flex justify-center gap-4 mt-8">
            <Button variant="outline" size="lg" asChild>
              <Link href="/">
                <Home className="h-5 w-5 mr-2" />
                홈으로
              </Link>
            </Button>
            <Button size="lg" asChild>
              <Link href="/mypage">
                <ShoppingBag className="h-5 w-5 mr-2" />
                구매내역 확인
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

