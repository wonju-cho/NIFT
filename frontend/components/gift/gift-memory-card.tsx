"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useGiftCardMobile } from "@/hooks/use-giftcard-mobile"

interface GiftMemoryCardProps {
  cardData?: {
    frontTemplate: {
      background: string
    }
    backTemplate: {
      background: string
    }
    frontElements: any[]
    backElements: any[]
  }
  isAccepted: boolean
  onAccept?: () => void
  className?: string
  showFlipHint?: boolean
  isDetailView?: boolean
}

export function GiftMemoryCard({
  cardData,
  isAccepted,
  onAccept,
  className,
  showFlipHint = true,
  isDetailView = false,
}: GiftMemoryCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const isGiftCardMobile = useGiftCardMobile()

  // 카드 뒤집기 핸들러
  const handleFlip = () => {
    if (isAccepted) {
      setIsFlipped(!isFlipped)
    }
  }

  // 카드 요소 렌더링 함수 - 간소화된 버전
  const renderSimplifiedCard = (elements: any[], isBackside = false) => {
    if (!elements || elements.length === 0) return null

    // 텍스트 요소만 필터링
    const textElements = elements.filter((el) => el.type === "text")

    // 이미지 요소만 필터링
    const imageElements = elements.filter((el) => el.type === "image" && el.src)

    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-4">
        {/* 텍스트 요소들 */}
        {textElements.map((element, index) => (
          <div
            key={element.id || index}
            className="text-center mb-2"
            style={{
              fontFamily: element.fontFamily || "inherit",
              zIndex: element.zIndex || 1,
            }}
          >
            <span className="text-lg font-medium">{element.content}</span>
          </div>
        ))}

        {/* 이미지 요소들 */}
        {imageElements.length > 0 && (
          <div className="flex justify-center mt-2">
            {imageElements.map((element, index) => (
              <div key={element.id || `img-${index}`} className="mx-1">
                <Image
                  src={element.src || "/placeholder.svg"}
                  alt="Card element"
                  width={80}
                  height={80}
                  className="object-contain"
                />
              </div>
            ))}
          </div>
        )}

        {/* 뒷면인 경우 뒤집기 힌트 */}
        {isBackside && showFlipHint && <div className="mt-4 text-xs text-gray-500">클릭하여 앞면 보기</div>}
      </div>
    )
  }

  return (
    <div
      className={cn("relative w-full h-full rounded-lg overflow-hidden cursor-pointer", className)}
      onClick={handleFlip}
    >
      {isAccepted ? (
        // 수락된 선물 - 카드 표시
        <div
          className="w-full h-full transition-transform duration-500"
          style={{
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            transformStyle: "preserve-3d",
          }}
        >
          {/* 앞면 */}
          <div
            className="absolute inset-0 backface-hidden"
            style={{
              background: cardData?.frontTemplate.background || "white",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {cardData?.frontElements && renderSimplifiedCard(cardData.frontElements)}
          </div>

          {/* 뒷면 */}
          <div
            className="absolute inset-0 backface-hidden"
            style={{
              background: cardData?.backTemplate.background || "white",
              backgroundSize: "cover",
              backgroundPosition: "center",
              transform: "rotateY(180deg)",
            }}
          >
            {cardData?.backElements && renderSimplifiedCard(cardData.backElements, true)}
          </div>
        </div>
      ) : (
        // 미수락 선물 - 선물 상자 표시
        <div className="w-full h-full flex items-center justify-center"
          style={{
            backgroundImage: `url('/gift-box.png')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
          >
          <div className="text-center">
            {onAccept && (
              <Button
                size="sm"
                className="mt-2"
                onClick={(e) => {
                  e.stopPropagation()
                  onAccept()
                }}
              >
                선물 수락하기
              </Button>
            )}
          </div>
        </div>
      )}

      {/* 카드 뒤집기 힌트 (수락된 경우만) */}
      {isAccepted && showFlipHint && !isFlipped && (
        <div className="absolute bottom-2 right-2 text-xs text-gray-500 bg-white/70 px-2 py-1 rounded-full">
          클릭하여 뒷면 보기
        </div>
      )}

      {/* 스타일 */}
      <style jsx global>{`
        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
      `}</style>
    </div>
  )
}

