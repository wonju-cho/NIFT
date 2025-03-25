"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { CardPreview } from "@/components/gift/card-preview"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreditCard, Wallet, Gift } from "lucide-react"

export default function GiftPaymentPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [product, setProduct] = useState<any>(null)
  const [cardData, setCardData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [recipientPhone, setRecipientPhone] = useState("")
  const [recipientMessage, setRecipientMessage] = useState("")
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [agreedTerms, setAgreedTerms] = useState(false)

  // 페이지 로드 시 상품 정보와 카드 데이터 가져오기
  useEffect(() => {
    // 실제 환경에서는 API 호출로 상품 정보를 가져옵니다
    const fetchProductData = async () => {
      try {
        // 임시 데이터 - 실제로는 API에서 가져옵니다
        const mockProduct = {
          id: params.id,
          title: "스타벅스 아메리카노 Tall",
          price: 4000,
          originalPrice: 4500,
          category: "커피/음료",
          description: "스타벅스 아메리카노 Tall 사이즈 기프티콘입니다. 유효기간은 구매일로부터 30일입니다.",
          image: "/placeholder.svg?height=400&width=400",
          expiryDate: "2023-12-31",
        }

        setProduct(mockProduct)

        // 로컬 스토리지에서 카드 데이터 가져오기
        const savedCardData = localStorage.getItem(`card-data-${params.id}`)
        if (savedCardData) {
          setCardData(JSON.parse(savedCardData))
        }

        setIsLoading(false)
      } catch (error) {
        console.error("상품 정보 또는 카드 데이터를 가져오는 데 실패했습니다:", error)
        setIsLoading(false)
      }
    }

    fetchProductData()
  }, [params.id])

  // 결제 처리
  const handlePayment = async () => {
    if (!agreedTerms) {
      alert("결제 진행을 위해 약관에 동의해주세요.")
      return
    }

    if (!recipientPhone) {
      alert("받는 분 전화번호를 입력해주세요.")
      return
    }

    // 여기서 실제 결제 처리를 수행합니다
    // API 호출 등의 로직이 들어갑니다

    try {
      setIsLoading(true)

      // 결제 처리 성공 후 주문 완료 페이지로 이동
      setTimeout(() => {
        // 실제 환경에서는 실제 결제 API 호출 후 이동
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

  if (!product || !cardData) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 py-12">
          <div className="container text-center">
            <h1 className="text-2xl font-bold mb-4">정보를 불러올 수 없습니다</h1>
            <p className="text-gray-500 mb-6">상품 정보 또는 카드 데이터를 찾을 수 없습니다.</p>
            <Button onClick={() => router.push(`/product/${params.id}`)}>상품 페이지로 돌아가기</Button>
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
            {/* 좌측: 상품 정보 및 카드 미리보기 */}
            <div className="lg:col-span-2 space-y-6">
              {/* 상품 정보 */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4">선물할 상품</h2>
                  <div className="flex gap-4">
                    <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border bg-gray-100">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{product.title}</h3>
                      <div className="mt-1 flex items-baseline gap-2">
                        <span className="text-lg font-bold">{product.price.toLocaleString()}원</span>
                        {product.originalPrice > product.price && (
                          <span className="text-sm text-gray-500 line-through">
                            {product.originalPrice.toLocaleString()}원
                          </span>
                        )}
                      </div>
                      <p className="mt-2 text-sm text-gray-500">{product.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 카드 미리보기 */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">선물 카드 미리보기</h2>
                    <Button variant="outline" size="sm" asChild>
                      <a href={`/gift/${params.id}/customize`}>카드 수정하기</a>
                    </Button>
                  </div>

                  <CardPreview cardData={cardData} className="w-full max-w-[500px] mx-auto" />
                </CardContent>
              </Card>

              {/* 받는 사람 정보 */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4">받는 사람 정보</h2>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="recipient-phone" className="block mb-1">
                        받는 분 전화번호 <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="recipient-phone"
                        type="tel"
                        placeholder="'-' 없이 숫자만 입력해주세요"
                        value={recipientPhone}
                        onChange={(e) => setRecipientPhone(e.target.value)}
                        required
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        입력한 번호로 선물이 전송됩니다. 정확하게 입력해주세요.
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="recipient-message" className="block mb-1">
                        받는 분께 보낼 메시지
                      </Label>
                      <Textarea
                        id="recipient-message"
                        placeholder="선물과 함께 보낼 메시지를 입력해주세요."
                        rows={3}
                        value={recipientMessage}
                        onChange={(e) => setRecipientMessage(e.target.value)}
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="anonymous"
                        className="rounded border-gray-300"
                        checked={isAnonymous}
                        onChange={(e) => setIsAnonymous(e.target.checked)}
                      />
                      <Label htmlFor="anonymous">익명으로 보내기</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 우측: 결제 정보 */}
            <div>
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4">결제 정보</h2>

                  <div className="space-y-4">
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">상품 금액</span>
                      <span className="font-medium">{product.price.toLocaleString()}원</span>
                    </div>

                    {product.originalPrice > product.price && (
                      <div className="flex justify-between py-2 text-primary">
                        <span>할인 금액</span>
                        <span>-{(product.originalPrice - product.price).toLocaleString()}원</span>
                      </div>
                    )}

                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">선물 포장</span>
                      <span className="font-medium">무료</span>
                    </div>

                    <Separator />

                    <div className="flex justify-between py-2">
                      <span className="font-medium">최종 결제 금액</span>
                      <span className="text-lg font-bold text-primary">{product.price.toLocaleString()}원</span>
                    </div>

                    <div className="pt-4">
                      <h3 className="font-medium mb-3">결제 수단</h3>
                      <Tabs defaultValue="card" onValueChange={setPaymentMethod} className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="card">
                            <CreditCard className="h-4 w-4 mr-2" />
                            신용카드
                          </TabsTrigger>
                          <TabsTrigger value="simple">
                            <Wallet className="h-4 w-4 mr-2" />
                            간편결제
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="card" className="pt-4">
                          <RadioGroup defaultValue="direct">
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="direct" id="direct" />
                              <Label htmlFor="direct">일반 결제</Label>
                            </div>
                            <div className="flex items-center space-x-2 mt-2">
                              <RadioGroupItem value="installment" id="installment" />
                              <Label htmlFor="installment">할부 결제</Label>
                            </div>
                          </RadioGroup>
                        </TabsContent>

                        <TabsContent value="simple" className="pt-4">
                          <RadioGroup defaultValue="kakao">
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="kakao" id="kakao" />
                              <Label htmlFor="kakao">카카오페이</Label>
                            </div>
                            <div className="flex items-center space-x-2 mt-2">
                              <RadioGroupItem value="naver" id="naver" />
                              <Label htmlFor="naver">네이버페이</Label>
                            </div>
                            <div className="flex items-center space-x-2 mt-2">
                              <RadioGroupItem value="payco" id="payco" />
                              <Label htmlFor="payco">페이코</Label>
                            </div>
                          </RadioGroup>
                        </TabsContent>
                      </Tabs>
                    </div>

                    <div className="flex items-center gap-2 mt-6">
                      <input
                        type="checkbox"
                        id="terms-agree"
                        className="rounded border-gray-300"
                        checked={agreedTerms}
                        onChange={(e) => setAgreedTerms(e.target.checked)}
                        required
                      />
                      <Label htmlFor="terms-agree">주문 내용 확인 및 결제 진행에 동의합니다</Label>
                    </div>

                    <Button className="w-full mt-4" size="lg" disabled={isLoading} onClick={handlePayment}>
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          결제 처리 중...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Gift className="h-5 w-5" />
                          {product.price.toLocaleString()}원 결제하기
                        </span>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

