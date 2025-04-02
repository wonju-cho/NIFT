"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { postCardDesign, sendGiftHistory } from "@/lib/api/CreateGiftHistory";
import GiftPaymentButton from "./GiftPaymentButton";
import { giftToFriend } from "@/lib/api/web3";

interface Friend {
  uuid: string;
  kakaoId: number;
  profile_nickname: string;
  profile_thumbnail_image: string;
}

interface GiftPaymentSummaryProps {
  article: any;
  agreedTerms: boolean;
  setAgreedTerms: (val: boolean) => void;
  onSubmit: () => void;
  isLoading: boolean;
  cardId: string;
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
  type,
}: GiftPaymentSummaryProps) {
  console.log(selectedFriend);

  const handlePayment = async () => {
    if (!agreedTerms) {
      alert("주문 내용 확인 및 결제 진행에 동의해주세요.");
      return;
    }
    console.log("handlePayment 실행됨");

    try {
      const accessToken = localStorage.getItem("access_token");
      const rawCardData = localStorage.getItem(`card-data-${cardId}`);
      if (!rawCardData) throw new Error("카드 데이터 없음");

      const cardData = JSON.parse(rawCardData);
      const mongoId = await postCardDesign(cardData, accessToken!);
      const idToSend = type === "article" ? Number(cardId) : article.gifticonId;

      localStorage.setItem(
        `article-data-${cardId}`,
        JSON.stringify(
          {
            ...article,
            profile_nickname: selectedFriend?.profile_nickname || "수령인",
          },
          (_, value) => (typeof value === "bigint" ? value.toString() : value)
        )
      );

      console.log(
        "giftToFriend params",
        article.serialNum,
        article.price,
        selectedFriend?.kakaoId
      );

      console.log("giftToFriend 호출 전");

      const tx = await giftToFriend(
        article.serialNum,
        String(selectedFriend?.kakaoId)
      );

      if (!tx.success) {
        throw new Error("NFT 선물 전송 실패");
      }

      console.log("sendGiftHistory 호출 전");

      // 선물 보내기 API 호출
      await sendGiftHistory({
        toUserKakaoId: Number(selectedFriend!.kakaoId),
        gifticonId: Number(idToSend),
        mongoId,
        type,
        txHashPurchase: String(tx.txHashPurchase),
        txHashGift: String(tx.txHashGift),
      });

      // 카드 데이터 localStorage에서 삭제
      setTimeout(() => {
        localStorage.removeItem(`card-data-${cardId}`);
      }, 60 * 1000); // 1분 뒤 삭제

      await onSubmit(); // 이후 gift_histories 저장 등 진행
    } catch (err) {
      alert(`결제 처리 중 오류 발생: ${(err as Error).message}`);
      console.error(err);

      // ⚠️ 실패해도 일정 시간 뒤에 card-data 삭제 예약
      setTimeout(() => {
        localStorage.removeItem(`card-data-${cardId}`);
      }, 60 * 5000); // 5분 뒤 삭제
    }
  };

  return (
    <Card className="sticky top-24">
      <CardContent className="p-6">
        <h2 className="text-xl font-bold mb-4">결제 정보</h2>
        <div className="space-y-4">
          <div className="flex justify-between py-2">
            <span className="text-gray-600">상품 금액</span>
            <span className="font-medium">
              {article.price.toLocaleString()}원
            </span>
          </div>
          {article.originalPrice > article.price && (
            <div className="flex justify-between py-2 text-primary">
              <span>할인 금액</span>
              <span>
                -{(article.originalPrice - article.price).toLocaleString()}원
              </span>
            </div>
          )}
          <div className="flex justify-between py-2">
            <span className="text-gray-600">선물 포장</span>
            <span className="font-medium">무료</span>
          </div>
          <Separator />
          <div className="flex justify-between py-2">
            <span className="font-medium">최종 결제 금액</span>
            <span className="text-lg font-bold text-primary">
              {article.price.toLocaleString()}원
            </span>
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
            <Label htmlFor="terms-agree">
              주문 내용 확인 및 결제 진행에 동의합니다
            </Label>
          </div>

          <GiftPaymentButton
            article={article}
            isLoading={isLoading}
            disabled={!agreedTerms}
            onClick={() => {
              console.log("함수 호출됨 ");

              handlePayment();
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
