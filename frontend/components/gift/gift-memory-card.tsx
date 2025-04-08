"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useGiftCardMobile } from "@/hooks/use-giftcard-mobile"

const CARD_WIDTH = 400
const CARD_HEIGHT = 600

interface GiftMemoryCardProps {
  cardData?: {
    frontTemplate: { background: string }
    backTemplate: { background: string }
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
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const isGiftCardMobile = useGiftCardMobile()

  useEffect(() => {
    const resize = () => {
      if (containerRef.current && !isDetailView) {
        const { clientWidth } = containerRef.current
        setScale(clientWidth / CARD_WIDTH)
      } else {
        setScale(1)
      }
    }
    resize()
    window.addEventListener("resize", resize)
    return () => window.removeEventListener("resize", resize)
  }, [isDetailView])

  const handleFlip = () => {
    if (isAccepted) setIsFlipped(!isFlipped)
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative rounded-lg overflow-hidden cursor-pointer",
        isDetailView ? "" : "w-full aspect-[2/3] min-w-[150px] min-h-[250px]",
        className
      )}
      onClick={handleFlip}
      style={
        isDetailView
          ? { width: `${CARD_WIDTH}px`, height: `${CARD_HEIGHT}px` }
          : undefined
      }
    >
      {isAccepted ? (
        <div
          className="w-full h-full transition-transform duration-500"
          style={{
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            transformStyle: "preserve-3d",
          }}
        >
          <CardFace
            background={cardData?.frontTemplate.background}
            elements={cardData?.frontElements || []}
            flipped={false}
            scale={scale}
          />
          <CardFace
            background={cardData?.backTemplate.background}
            elements={cardData?.backElements || []}
            flipped={true}
            scale={scale}
          />
        </div>
      ) : (
        <div className="w-full h-full bg-blue-50 flex items-center justify-center">
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <Image
                src="/placeholder.svg?height=80&width=80&text=🎁"
                alt="Gift box"
                width={80}
                height={80}
              />
            </div>
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

      {isAccepted && showFlipHint && !isFlipped && (
        <div className="absolute bottom-2 right-2 text-xs text-gray-500 bg-white/70 px-2 py-1 rounded-full">
          클릭하여 뒷면 보기
        </div>
      )}

      <style jsx global>{`
        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
      `}</style>
    </div>
  )
}

function CardFace({
  background,
  elements,
  flipped,
  scale,
}: {
  background?: string
  elements: any[]
  flipped: boolean
  scale: number
}) {
  return (
    <div
      className="absolute inset-0 backface-hidden"
      style={{
        transform: flipped ? "rotateY(180deg)" : "none",
      }}
    >
      <div
        className="relative"
        style={{
          width: `${CARD_WIDTH}px`,
          height: `${CARD_HEIGHT}px`,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        {background?.startsWith("data:image") ? (
          <Image
            src={background}
            alt="card-bg"
            fill
            className="object-cover"
            style={{ zIndex: 0 }}
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        )}
        {renderCardElements(elements, scale)}
      </div>
    </div>
  )
}

function renderCardElements(elements: any[], scale: number) {
  return elements.map((el) => {
    const style = {
      position: "absolute" as const,
      left: `${el.x * scale}px`,
      top: `${el.y * scale}px`,
      width: `${el.width * scale}px`,
      height: `${el.height * scale}px`,
      transform: `rotate(${el.rotation}deg)`,
      zIndex: el.zIndex,
      fontFamily: el.fontFamily || "inherit",
    }

    if (el.type === "text") {
      return (
        <div key={el.id} style={{ ...style, fontSize: `${16 * scale}px` }}>
          {el.content}
        </div>
      )
    }

    if (el.type === "sticker") {
      const isEmoji = el.src?.includes("text=")
      if (isEmoji) {
        const emojiChar = decodeURIComponent(el.src.split("text=")[1] || "")
        return (
          <div key={el.id} style={{ ...style, fontSize: `${28 * scale}px` }}>
            {emojiChar}
          </div>
        )
      } else {
        const blobUrl = getBlobUrlIfBase64(el.src)
        return <img key={el.id} src={blobUrl || el.src} alt="Sticker" style={style} />
      }
    }

    if (el.type === "image" && el.src) {
      const blobUrl = getBlobUrlIfBase64(el.src)
      return <img key={el.id} src={blobUrl || el.src} alt="Image" style={style} />
    }

    return null
  })
}

function getBlobUrlIfBase64(src?: string): string | null {
  if (!src || !src.startsWith("data:image")) return null
  try {
    const mime = src.substring(src.indexOf(":") + 1, src.indexOf(";"))
    const base64Data = src.split(",")[1]
    const byteCharacters = atob(base64Data)
    const byteArrays = []
    for (let i = 0; i < byteCharacters.length; i++) {
      byteArrays.push(byteCharacters.charCodeAt(i))
    }
    const byteArray = new Uint8Array(byteArrays)
    const blob = new Blob([byteArray], { type: mime })
    return URL.createObjectURL(blob)
  } catch (e) {
    console.error("Base64 변환 실패:", e)
    return null
  }
}