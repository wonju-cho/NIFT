"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { GiftProductInfo } from "./GiftProductInfo";
import { GiftCardPreview } from "./GiftCardPreview";
import { GiftRecipientForm } from "./GiftRecipientForm";
import { GiftPaymentSummary } from "./GiftPaymentSummary";
import { Button } from "@/components/ui/button";
import { getArticleById } from "@/lib/api/ArticleService";
import { getSerialInfo, giftToFriend } from "@/lib/api/web3";
import { postCardDesign, sendGiftHistory } from "@/lib/api/CreateGiftHistory";
import { sendKakaoMessage } from "@/lib/api/sendKakaoMessage";

interface Friend {
  uuid: string;
  kakaoId: number;
  profile_nickname: string;
  profile_thumbnail_image: string;
}

export default function GiftPaymentPageContent({
  params,
  type,
}: {
  params: { id: string };
  type: string;
}) {
  const router = useRouter();
  const [article, setArticle] = useState<any>(null);
  const [cardData, setCardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [recipientPhone, setRecipientPhone] = useState("");
  const [recipientMessage, setRecipientMessage] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (type === "article") {
          const article = await getArticleById(params.id);
          setArticle({
            gifticonId: article.gifticonId,
            serialNum: article.serialNum,
            image: article.imageUrl,
            title: article.title,
            description: article.description,
            price: article.currentPrice,
            originalPrice: article.originalPrice,
            brandName: article.brandName,
          });
        } else if (type === "gifticon") {
          const gifticon = await getSerialInfo(Number(params.id));

          setArticle({
            gifticonId: gifticon.gifticonId,
            serialNum: gifticon.serialNum,
            image: gifticon.imageUrl,
            title: gifticon.gifticonTitle,
            description: gifticon.description,
            price: gifticon.price,
            originalPrice: gifticon.originalPrice,
            brandName: gifticon.brandName,
          });
        }

        const savedCardData = localStorage.getItem(`card-data-${params.id}`);
        if (savedCardData) setCardData(JSON.parse(savedCardData));

        setIsLoading(false);
      } catch (err) {
        console.error("선물 상품 데이터 불러오기 실패: ", err);
        setIsLoading(true);
      }
    };
    fetchData();
  }, [params.id, type]);

  const handlePayment = async () => {
    const cardId = params.id;
    if (!agreedTerms) {
      alert("주문 내용 확인 및 결제 진행에 동의해주세요.");
      return;
    }

    console.log("handlePayment 실행됨");

    try {
      setIsLoading(true);
      const accessToken = localStorage.getItem("access_token");
      const kakaoaccessToken = localStorage.getItem("kakao_access_token");
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

      // 선물 받을 친구에게 메세지 전송
      await sendKakaoMessage(
        kakaoaccessToken!,
        [selectedFriend!.uuid],
        118821,
        { THU: article.image }
      );

      router.push(`/gift/${params.id}/complete`);

      // 카드 데이터 localStorage에서 삭제
      setTimeout(() => {
        localStorage.removeItem(`card-data-${cardId}`);
      }, 60 * 1000); // 1분 뒤 삭제
    } catch (err) {
      console.error("결제 처리 중 오류가 발생했습니다:", err);
      setIsLoading(false);
      alert("결제 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-white-500">로딩 중...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!article || !cardData) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 py-12">
          <div className="container text-center">
            <h1 className="text-2xl font-bold mb-4">
              정보를 불러올 수 없습니다
            </h1>
            <p className="text-white-500 mb-6">
              상품 정보 또는 카드 데이터를 찾을 수 없습니다.
            </p>
            <Button onClick={() => router.push(`/article/${params.id}`)}>
              상품 페이지로 돌아가기
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-white py-12">
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
                selectedFriend={selectedFriend}
                setSelectedFriend={setSelectedFriend}
              />
            </div>

            <div>
              <GiftPaymentSummary
                article={article}
                agreedTerms={agreedTerms}
                setAgreedTerms={setAgreedTerms}
                onSubmit={handlePayment}
                isLoading={isLoading}
                cardId={params.id}
                selectedFriend={selectedFriend}
                type={type}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
