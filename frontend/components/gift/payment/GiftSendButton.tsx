import { useState } from "react"
import { useRouter } from "next/navigation"
import { Gift } from "lucide-react"
import { Button } from "@/components/ui/button"
import { sendKakaoGiftMessage } from "@/app/api/kakao-send-gift"
import { createGiftHistory } from "@/lib/api/CreateGiftHistory"

interface GiftSendButtonProps {
  article: {
    id: string
    price: number
    image: string
  }
  isLoading: boolean
  setIsLoading: (val: boolean) => void
  onSuccessRedirect: string
  kakaoAccessToken: string
}

export function GiftSendButton({
  article,
  isLoading,
  setIsLoading,
  onSuccessRedirect,
  kakaoAccessToken,
}: GiftSendButtonProps) {
  const router = useRouter()

  const handleClick = async () => {
    try {
      setIsLoading(true)

      // 1. 선물 히스토리 생성 API 호출
      await createGiftHistory(article.id)

      // 2. 카카오 메시지 전송
      await sendKakaoGiftMessage({
        accessToken: kakaoAccessToken,
        templateId: 118821,
        imageUrl: article.image,
      })

      // 3. 완료 페이지 이동
      router.push(onSuccessRedirect)
    } catch (err) {
      console.error("선물 전송 중 오류", err)
      alert("선물 전송에 실패했습니다. 다시 시도해주세요.")
    } finally {
      setIsLoading(false)
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
