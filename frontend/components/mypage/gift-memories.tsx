"use client";

import { useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { GiftMemoryCard } from "@/components/gift/gift-memory-card";
import { cn } from "@/lib/utils";
import { useGiftCardMobile } from "@/hooks/use-giftcard-mobile";
import type { GiftMemory } from "@/types/gift-memory";
// 상단에 GiftUnboxAnimation 컴포넌트 import 추가
import { GiftUnboxAnimation } from "@/components/gift/gift-animation/gift-unbox-animation";
import { UserNFT } from "@/lib/api/web3";

// 샘플 데이터
const sampleGiftMemories: GiftMemory[] = [
  {
    id: "1",
    senderName: "김영민",
    senderNickname: "영민",
    sentDate: "2025-01-23T08:43:00",
    isAccepted: true,
    acceptedDate: "2025-01-23T09:15:00",
    cardData: {
      frontTemplate: {
        background: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
      },
      backTemplate: {
        background: "white",
      },
      frontElements: [
        {
          id: "text-1",
          type: "text",
          content: "FOR YOU",
          x: 150,
          y: 80,
          width: 100,
          height: 40,
          rotation: 0,
          zIndex: 2,
          fontFamily: "'Noto Sans KR', sans-serif",
        },
        {
          id: "text-2",
          type: "text",
          content: "kakaotalk gift",
          x: 130,
          y: 130,
          width: 140,
          height: 30,
          rotation: 0,
          zIndex: 2,
          fontFamily: "'Gaegu', cursive",
        },
        {
          id: "image-1",
          type: "image",
          src: "/placeholder.svg?height=100&width=100",
          x: 150,
          y: 180,
          width: 100,
          height: 100,
          rotation: 0,
          zIndex: 1,
        },
      ],
      backElements: [
        {
          id: "recipient-element",
          type: "text",
          content: "To. 친구",
          x: 50,
          y: 50,
          width: 300,
          height: 50,
          rotation: 0,
          zIndex: 1,
          fontFamily: "'Noto Serif KR', serif",
        },
        {
          id: "message-element",
          type: "text",
          content: "생일 축하해! 맛있게 먹어~",
          x: 50,
          y: 120,
          width: 300,
          height: 150,
          rotation: 0,
          zIndex: 1,
          fontFamily: "'Gaegu', cursive",
        },
      ],
    },
    giftItem: {
      id: "item-1",
      title: "스타벅스 아메리카노 Tall",
      brand: "스타벅스",
      price: 4500,
      image: "/placeholder.svg?height=400&width=400",
    },
  },
  {
    id: "2",
    senderName: "김영민",
    senderNickname: "영민",
    sentDate: "2025-01-23T08:43:00",
    isAccepted: false,
    cardData: {
      frontTemplate: {
        background: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
      },
      backTemplate: {
        background: "white",
      },
      frontElements: [],
      backElements: [],
    },
    giftItem: {
      id: "item-2",
      title: "배스킨라빈스 파인트",
      brand: "배스킨라빈스",
      price: 9800,
      image: "/placeholder.svg?height=400&width=400",
    },
  },
  {
    id: "3",
    senderName: "이지은",
    senderNickname: "지은",
    sentDate: "2025-01-20T14:22:00",
    isAccepted: true,
    acceptedDate: "2025-01-20T15:30:00",
    cardData: {
      frontTemplate: {
        background: "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)",
      },
      backTemplate: {
        background: "white",
      },
      frontElements: [
        {
          id: "text-1",
          type: "text",
          content: "생일 축하해!",
          x: 120,
          y: 100,
          width: 160,
          height: 40,
          rotation: 0,
          zIndex: 2,
          fontFamily: "'Jua', sans-serif",
        },
        {
          id: "image-1",
          type: "image",
          src: "/placeholder.svg?height=100&width=100&text=🎂",
          x: 150,
          y: 180,
          width: 100,
          height: 100,
          rotation: 0,
          zIndex: 1,
        },
      ],
      backElements: [
        {
          id: "recipient-element",
          type: "text",
          content: "To. 친구",
          x: 50,
          y: 50,
          width: 300,
          height: 50,
          rotation: 0,
          zIndex: 1,
          fontFamily: "'Noto Serif KR', serif",
        },
        {
          id: "message-element",
          type: "text",
          content: "생일 축하해! 행복한 하루 보내~",
          x: 50,
          y: 120,
          width: 300,
          height: 150,
          rotation: 0,
          zIndex: 1,
          fontFamily: "'Gaegu', cursive",
        },
      ],
    },
    giftItem: {
      id: "item-3",
      title: "CGV 영화 관람권",
      brand: "CGV",
      price: 13000,
      image: "/placeholder.svg?height=400&width=400",
    },
  },
];

interface GiftMemoriesProps {
  giftData: UserNFT[];
}

export function GiftMemories({ giftData }: GiftMemoriesProps) {
  const [memories, setMemories] = useState<GiftMemory[]>(sampleGiftMemories);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedGift, setSelectedGift] = useState<GiftMemory | null>(null);
  // useState 부분에 다음 상태 추가
  const [isUnboxing, setIsUnboxing] = useState(false);
  const isGiftCardMobile = useGiftCardMobile();
  const itemsPerPage = 4; // 페이지당 아이템 수 감소
  const totalPages = Math.ceil(memories.length / itemsPerPage);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1));
  };

  // handleAcceptGift 함수를 다음과 같이 수정
  const handleAcceptGift = (giftId: string) => {
    // 언박싱 애니메이션 시작
    setIsUnboxing(true);

    // 선택된 선물이 있고 그 선물의 ID가 수락한 선물의 ID와 같다면 선택된 선물도 업데이트
    if (selectedGift && selectedGift.id === giftId) {
      // 애니메이션이 끝나면 상태 업데이트
      // 실제 구현에서는 여기서 API 호출을 통해 선물 수락 처리
      console.log(`선물 ${giftId} 수락 처리`);
    }
  };

  // 애니메이션 완료 후 처리 함수 추가
  const handleUnboxComplete = () => {
    if (selectedGift) {
      const now = new Date().toISOString();

      // 메모리 상태 업데이트
      const updatedMemories = memories.map((gift) =>
        gift.id === selectedGift.id
          ? { ...gift, isAccepted: true, acceptedDate: now }
          : gift
      );

      setMemories(updatedMemories);

      // 선택된 선물 상태 업데이트
      setSelectedGift({ ...selectedGift, isAccepted: true, acceptedDate: now });

      // 언박싱 상태 초기화
      setIsUnboxing(false);
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "yyyy.MM.dd a hh:mm", { locale: ko });
  };

  const currentItems = memories.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  return (
    <div className="space-y-6">
      {memories.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {currentItems.map((gift) => (
              <div
                key={gift.id}
                className="group relative overflow-hidden rounded-lg border bg-white transition-all hover:shadow-md"
              >
                <Dialog>
                  <DialogTrigger asChild>
                    <div
                      className="cursor-pointer"
                      onClick={() => setSelectedGift(gift)}
                    >
                      <div
                        className={cn(
                          "relative overflow-hidden",
                          isGiftCardMobile ? "aspect-[4/3]" : "h-[250px]" // 카드 높이 증가
                        )}
                      >
                        <GiftMemoryCard
                          cardData={gift.cardData}
                          isAccepted={gift.isAccepted}
                          showFlipHint={false}
                        />
                      </div>
                      <div className="p-3">
                        <div className="flex justify-between items-center">
                          <div className="text-sm font-medium">
                            from. {gift.senderNickname}
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatDate(gift.sentDate)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    {selectedGift && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">
                          {selectedGift.isAccepted
                            ? "선물 카드"
                            : "새로운 선물이 도착했습니다!"}
                        </h3>

                        {selectedGift && !selectedGift.isAccepted ? (
                          isUnboxing ? (
                            // 언박싱 애니메이션
                            <div className="w-full aspect-[4/3] relative overflow-hidden rounded-lg">
                              <GiftUnboxAnimation
                                gift={selectedGift}
                                onComplete={handleUnboxComplete}
                              />
                            </div>
                          ) : (
                            // 미수락 선물 상세 보기
                            <div className="text-center py-8">
                              <div className="flex justify-center mb-4">
                                <Image
                                  src="/placeholder.svg?height=120&width=120&text=🎁"
                                  alt="Gift box"
                                  width={120}
                                  height={120}
                                  className="object-contain"
                                />
                              </div>
                              <p className="mb-4">
                                <span className="font-medium">
                                  {selectedGift.senderNickname}
                                </span>
                                님이 보낸 선물이 도착했습니다.
                                <br />
                                선물을 수락하면 카드와 기프티콘을 확인할 수
                                있습니다.
                              </p>
                              <Button
                                onClick={() =>
                                  handleAcceptGift(selectedGift.id)
                                }
                              >
                                선물 수락하기
                              </Button>
                            </div>
                          )
                        ) : (
                          // 수락된 선물 상세 보기 (기존 코드 유지)
                          <>
                            <div className="w-full aspect-[4/3] relative overflow-hidden rounded-lg border">
                              <GiftMemoryCard
                                cardData={selectedGift.cardData}
                                isAccepted={true}
                                className="rounded-none border-none"
                                isDetailView={true}
                                showFlipHint={true}
                              />
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <div className="flex items-start gap-3">
                                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                                  <Image
                                    src={
                                      selectedGift.giftItem?.image ||
                                      "/placeholder.svg"
                                    }
                                    alt={selectedGift.giftItem?.title || ""}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div>
                                  <h4 className="font-medium">
                                    {selectedGift.giftItem?.title}
                                  </h4>
                                  <p className="text-sm text-gray-500">
                                    {selectedGift.giftItem?.brand}
                                  </p>
                                  <p className="text-sm font-medium mt-1">
                                    {selectedGift.giftItem?.price.toLocaleString()}
                                    원
                                  </p>
                                </div>
                              </div>
                            </div>
                          </>
                        )}

                        <div className="text-sm text-gray-500 mt-2">
                          <p>보낸 사람: {selectedGift.senderName}</p>
                          <p>보낸 날짜: {formatDate(selectedGift.sentDate)}</p>
                          {selectedGift.isAccepted &&
                            selectedGift.acceptedDate && (
                              <p>
                                수락 날짜:{" "}
                                {formatDate(selectedGift.acceptedDate)}
                              </p>
                            )}
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            ))}
          </div>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <Button
                variant="outline"
                size="icon"
                onClick={handlePrevPage}
                disabled={currentPage === 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm">
                {currentPage + 1} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={handleNextPage}
                disabled={currentPage === totalPages - 1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <div className="flex justify-center mb-4">
            <Package className="h-12 w-12 text-gray-300" />
          </div>
          <p>아직 선물 추억이 없습니다.</p>
        </div>
      )}
    </div>
  );
}
