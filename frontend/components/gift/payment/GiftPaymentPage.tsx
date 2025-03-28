"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { GiftProductInfo } from "./GiftProductInfo"
import { GiftCardPreview } from "./GiftCardPreview"
import { GiftRecipientForm } from "./GiftRecipientForm"
import { GiftPaymentSummary } from "./GiftPaymentSummary"
import { v4 as uuidv4 } from "uuid"
import { Button } from "@/components/ui/button"

export default function GiftPaymentPageContent({ 
  params,
  type,
}: { 
  params: { id: string };
  type: string;
}) {
  const router = useRouter()
  const [article, setArticle] = useState<any>(null)
  const [cardData, setCardData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [recipientPhone, setRecipientPhone] = useState("")
  const [recipientMessage, setRecipientMessage] = useState("")
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [agreedTerms, setAgreedTerms] = useState(false)

  useEffect(() => {
    const fetchArticleData = async () => {
      try {
        const mockArticle = {
          id: params.id,
          title: "스타벅스 아메리카노 Tall",
          price: 4000,
          originalPrice: 4500,
          category: "커피/음료",
          description: "스타벅스 아메리카노 Tall 사이즈 기프티콘입니다. 유효기간은 구매일로부터 30일입니다.",
          image: "/placeholder.svg?height=400&width=400",
          expiryDate: "2023-12-31",
        }
        setArticle(mockArticle)

        const savedCardData = localStorage.getItem(`card-data-${params.id}`)
        if (savedCardData) {
          try {
            const parsedData = JSON.parse(savedCardData)

            if (
              (!parsedData.frontElements || parsedData.frontElements.length === 0) &&
              parsedData.frontTemplate?.background?.startsWith("data:image/")
            ) {
              parsedData.frontElements = [
                {
                  id: uuidv4(),
                  type: "image",
                  src: parsedData.frontTemplate.background,
                  x: 0,
                  y: 0,
                  width: 400,
                  height: 300,
                  rotation: 0,
                  zIndex: 1,
                },
              ]
              parsedData.frontTemplate.background = "white"
            }

            parsedData.frontElements = parsedData.frontElements?.map((el: any) => {
              if (el.type === "image" && el.src && !el.src.startsWith("data:image/")) {
                el.src = "/placeholder.svg?height=200&width=200&text=이미지+로드+실패"
              }
              return el
            })

            parsedData.backElements = parsedData.backElements?.map((el: any) => {
              if (el.type === "image" && el.src && !el.src.startsWith("data:image/")) {
                el.src = "/placeholder.svg?height=200&width=200&text=이미지+로드+실패"
              }
              return el
            })

            setCardData(parsedData)
          } catch (error) {
            console.error("카드 데이터 파싱 오류:", error)
          }
        }

        setIsLoading(false)
      } catch (error) {
        console.error("상품 정보 또는 카드 데이터를 가져오는 데 실패했습니다:", error)
        setIsLoading(false)
      }
    }

    fetchArticleData()
  }, [params.id])

  const handlePayment = async () => {
    if (!agreedTerms) {
      alert("결제 진행을 위해 약관에 동의해주세요.")
      return
    }
    if (!recipientPhone) {
      alert("받는 분 전화번호를 입력해주세요.")
      return
    }
    try {
      setIsLoading(true)
      setTimeout(() => {
        router.push(`/gift/${params.id}/complete`)
      }, 1500)
    } catch (error) {
      console.error("결제 처리 중 오류가 발생했습니다:", error)
      setIsLoading(false)
      alert("결제 처리 중 오류가 발생했습니다. 다시 시도해주세요.")
    }
  }

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

  if (!article || !cardData) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 py-12">
          <div className="container text-center">
            <h1 className="text-2xl font-bold mb-4">정보를 불러올 수 없습니다</h1>
            <p className="text-gray-500 mb-6">상품 정보 또는 카드 데이터를 찾을 수 없습니다.</p>
            <Button onClick={() => router.push(`/article/${params.id}`)}>상품 페이지로 돌아가기</Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 py-12">
        <div className="container">
          <h1 className="text-3xl font-bold mb-6">선물하기 결제</h1>
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <GiftProductInfo article={article} />
              <GiftCardPreview cardData={cardData} id={params.id} />
              <GiftRecipientForm
                phone={recipientPhone}
                message={recipientMessage}
                isAnonymous={isAnonymous}
                setPhone={setRecipientPhone}
                setMessage={setRecipientMessage}
                setAnonymous={setIsAnonymous}
              />
            </div>

            <div>
              <GiftPaymentSummary
                article={article}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                agreedTerms={agreedTerms}
                setAgreedTerms={setAgreedTerms}
                onSubmit={handlePayment}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}