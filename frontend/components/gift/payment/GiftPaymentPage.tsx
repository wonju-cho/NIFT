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
import { getSerialInfo } from "@/lib/api/web3";

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
    if (!agreedTerms) {
      alert("결제 진행을 위해 약관에 동의해주세요.");
      return;
    }
    if (!recipientPhone) {
      alert("받는 분 전화번호를 입력해주세요.");
      return;
    }
    try {
      setIsLoading(true);
      setTimeout(() => {
        router.push(`/gift/${params.id}/complete`);
      }, 1500);
    } catch (error) {
      console.error("결제 처리 중 오류가 발생했습니다:", error);
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
