"use client"

import type React from "react"

import { useEffect, useState, useMemo } from "react"
import Image from "next/image"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import { ChevronLeft, ChevronRight, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { GiftMemoryCard } from "@/components/gift/gift-memory-card"
import { cn } from "@/lib/utils"
import { useGiftCardMobile } from "@/hooks/use-giftcard-mobile"
import type { GiftMemory } from "@/types/gift-memory"
// 상단에 GiftUnboxAnimation 컴포넌트 import 추가
import { GiftUnboxAnimation } from "@/components/gift/gift-animation/gift-unbox-animation"
import { getGift, getNFTDetailInfo, receiveNFT, type UserNFT } from "@/lib/api/web3"
import type { User } from "@/app/mypage/page"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Pagination } from "./pagination"

interface GiftMemoriesProps {
  user: User
  availableGiftCards: any[]
  setAvailableGiftCards: React.Dispatch<React.SetStateAction<any[]>>
}

export function GiftMemories({ user, availableGiftCards, setAvailableGiftCards }: GiftMemoriesProps) {
  const [gifts, setGifts] = useState<UserNFT[]>([])
  const [memories, setMemories] = useState<GiftMemory[]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [selectedGift, setSelectedGift] = useState<GiftMemory | null>(null)
  const [isUnboxing, setIsUnboxing] = useState(false)
  const isGiftCardMobile = useGiftCardMobile()
  const itemsPerPage = 4 // 페이지당 아이템 수 감소
  const totalPages = Math.ceil(memories.length / itemsPerPage)
  const [giftTab, setGiftTab] = useState("pending")

  async function fetchGifts() {
    const result = await getGift(user.kakaoId)
    setGifts(result)

    // Transform API data to match the GiftMemory format
    const transformedGifts = transformApiDataToGiftMemories(result)
    setMemories(transformedGifts)
  }

  useEffect(() => {
    fetchGifts()
  }, [user.kakaoId])

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))
  }

  // handleAcceptGift 함수를 다음과 같이 수정
  const handleAcceptGift = (giftId: string) => {
    // 언박싱 애니메이션 시작
    setIsUnboxing(true)

    // 선택된 선물이 있고 그 선물의 ID가 수락한 선물의 ID와 같다면 선택된 선물도 업데이트
    if (selectedGift && selectedGift.id === giftId) {
      // 애니메이션이 끝나면 상태 업데이트
      // 실제 구현에서는 여기서 API 호출을 통해 선물 수락 처리
      console.log(`선물 ${giftId} 수락 처리`)
    }
  }

  // 애니메이션 완료 후 처리 함수 추가
  const handleUnboxComplete = () => {
    if (selectedGift) {
      const now = new Date().toISOString()

      // 메모리 상태 업데이트
      const updatedMemories = memories.map((gift) =>
        gift.id === selectedGift.id ? { ...gift, isAccepted: true, acceptedDate: now } : gift,
      )

      setMemories(updatedMemories)

      // 선택된 선물 상태 업데이트
      setSelectedGift({ ...selectedGift, isAccepted: true, acceptedDate: now })

      // 언박싱 상태 초기화
      setIsUnboxing(false)
    }
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "yyyy.MM.dd a hh:mm", { locale: ko })
  }

  const currentItems = memories.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)

  // Add this function to transform API data to GiftMemory format
  const transformApiDataToGiftMemories = (apiData: UserNFT[]): GiftMemory[] => {
    // 카드 템플릿 정의
    const templates = [
      {
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
            content: "NIFT gift",
            x: 130,
            y: 130,
            width: 140,
            height: 30,
            rotation: 0,
            zIndex: 2,
            fontFamily: "'Gaegu', cursive",
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
            content: "선물을 받아주셔서 감사합니다!",
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
      {
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
            content: "선물이 도착했어요!",
            x: 120,
            y: 100,
            width: 160,
            height: 40,
            rotation: 0,
            zIndex: 2,
            fontFamily: "'Jua', sans-serif",
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
            content: "특별한 날을 축하합니다!",
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
    ]

    return apiData.map((item, index) => {
      // Determine if the gift is accepted based on isPending
      const isAccepted = !item.isPending

      // Create a date string from pendingDate
      const sentDate = new Date(Number(item.pendingDate) * 1000).toISOString()

      // Create an accepted date if the gift is accepted
      const acceptedDate = isAccepted
        ? new Date(Date.now() - Math.random() * 86400000).toISOString() // Random time within last 24 hours
        : undefined

      // Select a card template (alternate between the two templates)
      const cardTemplate = templates[index % templates.length]

      // Add the title to the card's front elements
      const frontElements = [...cardTemplate.frontElements]
      if (item.title) {
        frontElements.push({
          id: "title-element",
          type: "text",
          content: item.title,
          x: 150,
          y: 180,
          width: 200,
          height: 40,
          rotation: 0,
          zIndex: 2,
          fontFamily: "'Noto Sans KR', sans-serif",
        })
      }

      return {
        id: String(item.serialNum),
        senderName: "선물 보낸 사람", // Placeholder
        senderNickname: item.brand, // Use brand as sender nickname
        sentDate,
        isAccepted,
        acceptedDate,
        cardData: {
          ...cardTemplate,
          frontElements,
        },
        giftItem: {
          id: String(item.id),
          title: item.title,
          brand: item.brand,
          price: item.price || 0,
          image: item.image,
        },
      }
    })
  }

  // Create separate arrays for accepted and pending gifts
  const [acceptedGifts, pendingGifts] = useMemo(() => {
    const accepted = memories.filter((gift) => gift.isAccepted)
    const pending = memories.filter((gift) => !gift.isAccepted)
    return [accepted, pending]
  }, [memories])

  const handleReceive = async (gift: UserNFT) => {
    const response = await receiveNFT(gift.serialNum, user.kakaoId)
    if (response.success) {
      // Remove from gifts array
      setGifts(gifts.filter((g) => g.serialNum !== gift.serialNum))

      // Get updated NFT info
      const newInfo = await getNFTDetailInfo(gift.serialNum)

      // Update available gift cards
      const updatedUsedGiftCards = [...availableGiftCards, newInfo]
      setAvailableGiftCards(updatedUsedGiftCards)

      // Update memories to mark the gift as accepted
      setMemories((prevMemories) =>
        prevMemories.map((mem) =>
          mem.id === String(gift.serialNum)
            ? {
                ...mem,
                isAccepted: true,
                acceptedDate: new Date().toISOString(),
              }
            : mem,
        ),
      )

      alert("선물 받기가 완료 되었습니다")
    }
  }

  return (
    <Tabs value={giftTab} onValueChange={setGiftTab} className="space-y-8">
      <TabsList className="w-full">
        <TabsTrigger value="pending" className="flex-1">
          받을 수 있는 선물 ({pendingGifts.length})
        </TabsTrigger>
        <TabsTrigger value="accepted" className="flex-1">
          받은 선물 ({acceptedGifts.length})
        </TabsTrigger>
      </TabsList>

      {/* Pending Gifts */}
      <TabsContent value="pending">
        {pendingGifts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {pendingGifts.map((gift) => (
              <Dialog key={gift.id}>
                <DialogTrigger asChild>
                  <div className="cursor-pointer" onClick={() => setSelectedGift(gift)}>
                    <div className={cn("relative overflow-hidden", isGiftCardMobile ? "aspect-[4/3]" : "h-[250px]")}>
                      <GiftMemoryCard cardData={gift.cardData} isAccepted={gift.isAccepted} showFlipHint={false} />
                      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                        <Button variant="secondary" className="font-medium">선물 받기</Button>
                      </div>
                    </div>
                    <div className="p-4 flex justify-between items-center">
                      <div className="text-sm font-medium">from. {gift.senderNickname}</div>
                      <div className="text-xs text-gray-500">{formatDate(gift.sentDate)}</div>
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md p-6">
                  {selectedGift && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">새로운 선물이 도착했습니다!</h3>
                      {isUnboxing ? (
                        <GiftUnboxAnimation gift={selectedGift} onComplete={handleUnboxComplete} />
                      ) : (
                        <div className="text-center py-8">
                          <Image src="/placeholder.svg?height=120&width=120&text=🎁" alt="Gift box" width={120} height={120} />
                          <p className="mt-4 mb-4">
                            <span className="font-medium">{gift.senderNickname}</span>님이 보낸 선물이 도착했습니다.
                            <br />선물을 수락하면 카드와 기프티콘을 확인할 수 있습니다.
                          </p>
                          <Button onClick={() => {
                            const apiGift = gifts.find((g) => String(g.serialNum) === gift.id)
                            if (apiGift) handleReceive(apiGift)
                            else setIsUnboxing(true)
                          }}>
                            선물 수락하기
                          </Button>
                        </div>
                      )}
                      <div className="text-sm text-gray-500 text-left space-y-1 pt-4">
                        <p>보낸 사람: {gift.senderName}</p>
                        <p>보낸 날짜: {formatDate(gift.sentDate)}</p>
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <Package className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <p>받을 수 있는 선물이 없습니다.</p>
          </div>
        )}
      </TabsContent>

      {/* Accepted Gifts */}
      <TabsContent value="accepted">
        {acceptedGifts.length > 0 ? (
          <>
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
              {currentItems.map((gift) => (
                <Dialog key={gift.id}>
                  <DialogTrigger asChild>
                    <div className="cursor-pointer" onClick={() => setSelectedGift(gift)}>
                      <div className={cn("relative overflow-hidden", isGiftCardMobile ? "aspect-[4/3]" : "h-[250px]")}>
                        <GiftMemoryCard cardData={gift.cardData} isAccepted={true} showFlipHint={false} />
                      </div>
                      <div className="p-4 flex justify-between items-center">
                        <div className="text-sm font-medium">from. {gift.senderNickname}</div>
                        <div className="text-xs text-gray-500">{formatDate(gift.sentDate)}</div>
                      </div>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md p-6">
                    {selectedGift && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">선물 카드</h3>
                        <GiftMemoryCard cardData={selectedGift.cardData} isAccepted={true} isDetailView showFlipHint />
                        <div className="bg-gray-50 p-5 rounded-lg space-y-3">
                          <div className="flex gap-4 items-start">
                            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                              <Image
                                src={selectedGift.giftItem?.image || "/placeholder.svg"}
                                alt={selectedGift.giftItem?.title || ""}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <h4 className="font-medium">{selectedGift.giftItem?.title}</h4>
                              <p className="text-sm text-gray-500">{selectedGift.giftItem?.brand}</p>
                              <p className="text-sm font-medium mt-1">{selectedGift.giftItem?.price.toLocaleString()}원</p>
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500 text-left space-y-1 pt-4">
                          <p>보낸 사람: {selectedGift.senderName}</p>
                          <p>보낸 날짜: {formatDate(selectedGift.sentDate)}</p>
                          {selectedGift.acceptedDate && <p>수락 날짜: {formatDate(selectedGift.acceptedDate)}</p>}
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              ))}
            </div>
            {totalPages > 1 && (
                <Pagination
                currentPage={currentPage}
                totalPage={totalPages}
                setCurrentPage={setCurrentPage}
                />
            )}
          </>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <Package className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <p>아직 받은 선물이 없습니다.</p>
          </div>
        )}
      </TabsContent>
    </Tabs>
  )
}

