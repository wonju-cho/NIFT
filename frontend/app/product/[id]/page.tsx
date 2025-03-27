"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ArticleImage } from "@/components/articleDetail/ArticleImage";
import { ArticleInfo } from "@/components/articleDetail/ArticleInfo";
import { ArticleSellerCard } from "@/components/articleDetail/ArticleSellerCard";
import { ArticleTabs } from "@/components/articleDetail/ArticleTabs";

// TODO: 실제 API 호출 후 이 구조로 받을 예정
const mockData = {
  id: "123",
  title: "스타벅스 아메리카노 Tall",
  price: 4000,
  originalPrice: 4500,
  category: "커피/음료",
  image: "/placeholder.svg?height=600&width=600",
  isNew: true,
  expiryDate: "2023-12-31",
  listedAt: "3시간 전",
  views: 24,
  location: "서울 강남구",
  distance: "1.2km",
  description:
    "스타벅스 아메리카노 Tall 사이즈 기프티콘입니다. 유효기간은 구매일로부터 30일입니다.",
  seller: {
    id: "user123",
    name: "닉네임",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 4.8,
    transactions: 56,
  },
};

export default function ArticleDetailPage() {
  const params = useParams(); // id 추출
  const [amount, setAmount] = useState(1); // 수량 등 상태 필요 시 사용

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gray-50">
        <div className="container py-8">
          {/* 이미지 영역 */}
          <div className="grid gap-8 md:grid-cols-2">
            <ArticleImage
              src={mockData.image}
              title={mockData.title}
              isNew={mockData.isNew}
            />

            {/* 우측 상세 정보 */}
            <div className="flex flex-col rounded-lg bg-white p-6 shadow-sm">
              <ArticleInfo {...mockData} />
              <ArticleSellerCard seller={mockData.seller} />
              {/* 여기에 구매 버튼 등 추가 가능 */}
            </div>
          </div>

          {/* 탭 영역 */}
          <div className="mt-8">
            <ArticleTabs
              description={mockData.description}
              expiryDate={mockData.expiryDate}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
