import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { CreditCard, Wallet } from "lucide-react"
import GiftPaymentButton from "./GiftPaymentButton"

interface GiftPaymentSummaryProps {
  article: any
  paymentMethod: string
  setPaymentMethod: (val: string) => void
  agreedTerms: boolean
  setAgreedTerms: (val: boolean) => void
  onSubmit: () => void
  isLoading: boolean
  cardId: string
}

export function GiftPaymentSummary({
  article,
  paymentMethod,
  setPaymentMethod,
  agreedTerms,
  setAgreedTerms,
  onSubmit,
  isLoading,
  cardId
}: GiftPaymentSummaryProps) {
  return (
    <Card className="sticky top-24">
      <CardContent className="p-6">
        <h2 className="text-xl font-bold mb-4">결제 정보</h2>
        <div className="space-y-4">
          <div className="flex justify-between py-2">
            <span className="text-gray-600">상품 금액</span>
            <span className="font-medium">{article.price.toLocaleString()}원</span>
          </div>
          {article.originalPrice > article.price && (
            <div className="flex justify-between py-2 text-primary">
              <span>할인 금액</span>
              <span>-{(article.originalPrice - article.price).toLocaleString()}원</span>
            </div>
          )}
          <div className="flex justify-between py-2">
            <span className="text-gray-600">선물 포장</span>
            <span className="font-medium">무료</span>
          </div>
          <Separator />
          <div className="flex justify-between py-2">
            <span className="font-medium">최종 결제 금액</span>
            <span className="text-lg font-bold text-primary">{article.price.toLocaleString()}원</span>
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

          <GiftPaymentButton
            cardData={JSON.parse(localStorage.getItem(`card-data-${cardId}`)!)} // or props로 전달받은 값
            article={article}
            isLoading={isLoading}
            onComplete={(mongoId) => {
              // mongoId 받은 후 gift_histories 저장 또는 결제 flow 이어서 실행
              // console.log("✅ 카드 저장 완료! mongoId:", mongoId)
            }}
          />
        </div>
      </CardContent>
    </Card>
  )
}