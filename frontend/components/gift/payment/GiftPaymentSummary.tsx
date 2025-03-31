import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { postCardDesign, sendGiftHistory } from "@/lib/api/CreateGiftHistory";
import GiftPaymentButton from "./GiftPaymentButton"
import { useEffect } from "react";

interface Friend {
  uuid: string
  kakaoId: number
  profile_nickname: string
  profile_thumbnail_image: string
}

interface GiftPaymentSummaryProps {
  article: any
  agreedTerms: boolean
  setAgreedTerms: (val: boolean) => void
  onSubmit: () => void
  isLoading: boolean
  cardId: string
  selectedFriend: Friend | null;
  type: string;
}

export function GiftPaymentSummary({
  article,
  agreedTerms,
  setAgreedTerms,
  onSubmit,
  isLoading,
  cardId,
  selectedFriend,
  type
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
            article={article}
            isLoading={isLoading}
            disabled={!agreedTerms}
            onClick={async () => {
              if (!agreedTerms) {
                alert("주문 내용 확인 및 결제 진행에 동의해주세요.");
                return;
              }

              try {
                const accessToken = localStorage.getItem("access_token");
                const rawCardData = localStorage.getItem(`card-data-${cardId}`);
                if (!rawCardData) throw new Error("카드 데이터 없음");

                const cardData = JSON.parse(rawCardData);
                const mongoId = await postCardDesign(cardData, accessToken!);
                const idToSend = type === "article" ? Number(cardId) : article.gifticonId;

                localStorage.setItem(`article-data-${cardId}`, JSON.stringify({
                  ...article,
                  profile_nickname: selectedFriend?.profile_nickname || "수령인"
                }))


                // 선물 보내기 API 호출
                await sendGiftHistory(accessToken!, {
                  toUserKakaoId: Number(selectedFriend?.kakaoId),
                  gifticonId: idToSend,
                  mongoId,
                  type,
                });

                // 카드 데이터 localStorage에서 삭제
                setTimeout(() => {
                  localStorage.removeItem(`card-data-${cardId}`)
                }, 60 * 1000); // 1분 뒤 삭제

                await onSubmit(); // 이후 gift_histories 저장 등 진행
              } catch (err) {
                alert("카드 저장 또는 결제 처리 중 오류가 발생했습니다.");
                console.error(err);
              }
            }}
          />
        </div>
      </CardContent>
    </Card>
  )
}