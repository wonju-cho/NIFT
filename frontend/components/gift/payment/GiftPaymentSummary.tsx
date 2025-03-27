import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { CreditCard, Gift, Wallet } from "lucide-react"

interface GiftPaymentSummaryProps {
  article: any
  paymentMethod: string
  setPaymentMethod: (val: string) => void
  agreedTerms: boolean
  setAgreedTerms: (val: boolean) => void
  onSubmit: () => void
  isLoading: boolean
}

export function GiftPaymentSummary({
  article,
  paymentMethod,
  setPaymentMethod,
  agreedTerms,
  setAgreedTerms,
  onSubmit,
  isLoading,
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

          <div className="pt-4">
            <h3 className="font-medium mb-3">결제 수단</h3>
            <Tabs defaultValue="card" onValueChange={setPaymentMethod} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="card">
                  <CreditCard className="h-4 w-4 mr-2" />신용카드
                </TabsTrigger>
                <TabsTrigger value="simple">
                  <Wallet className="h-4 w-4 mr-2" />간편결제
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

          <Button className="w-full mt-4" size="lg" disabled={isLoading} onClick={onSubmit}>
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                결제 처리 중...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Gift className="h-5 w-5" />
                {article.price.toLocaleString()}원 결제하기
              </span>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}