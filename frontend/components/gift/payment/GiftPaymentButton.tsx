import { Gift } from "lucide-react";
import { Button } from "@/components/ui/button"
import { postCardDesign } from "@/lib/api/CreateGiftHistory";

interface GiftPaymentButtonProps {
  cardData: any // LocalStorage에서 가져온 카드 JSON
  article: any // 가격 정보 등
  onComplete: (mongoId: string) => void
  isLoading: boolean
}

export default function GiftPaymentButton({
  cardData,
  article,
  onComplete,
  isLoading,
}: GiftPaymentButtonProps) {
  const handleClick = async () => {
    try {
      const accessToken = localStorage.getItem("access_token");
      const mongoId = await postCardDesign(cardData, accessToken!) // 카드 저장
      
      // 히스토리도 저장

      // console.log("🎁카드 저장 완료")
      onComplete(mongoId)
    } catch (err) {
      alert("카드 저장 실패")
    }
  }

  return (
    <Button className="w-full mt-4" size="lg" disabled={isLoading} onClick={handleClick}>
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
  )
}