"use client"

import { useState } from "react"
import Image from "next/image"

const CARD_WIDTH = 600
const CARD_HEIGHT = 400

interface GiftMemoryCardFullViewProps {
  cardData: {
    frontTemplate: { background: string }
    backTemplate: { background: string }
    frontElements: any[]
    backElements: any[]
  }
}

export function GiftMemoryCardFullView({ cardData }: GiftMemoryCardFullViewProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  const frontBackground = cardData.frontTemplate.background
  const backBackground = cardData.backTemplate.background
  const frontElements = cardData.frontElements
  const backElements = cardData.backElements

  return (
    <div
      className="relative rounded-lg overflow-hidden"
      style={{
        width: `${CARD_WIDTH}px`,
        height: `${CARD_HEIGHT}px`,
        perspective: "1000px",
      }}
      onClick={() => setIsFlipped((prev) => !prev)}
    >
      <div
        className="absolute inset-0 transition-transform duration-700"
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        <CardFace background={frontBackground} elements={frontElements} flipped={false} />
        <CardFace background={backBackground} elements={backElements} flipped={true} />
      </div>

      <div className="absolute bottom-2 right-2 text-xs text-gray-500 bg-white/70 px-2 py-1 rounded-full">
        {isFlipped ? "클릭하여 앞면 보기" : "클릭하여 뒷면 보기"}
      </div>
    </div>
  )
}

function CardFace({
  background,
  elements,
  flipped,
}: {
  background: string
  elements: any[]
  flipped: boolean
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
        }}
      >
        {background?.startsWith("data:image") ? (
          <Image src={background} alt="card-bg" fill className="object-cover" />
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
        {renderCardElements(elements)}
      </div>
    </div>
  )
}

function renderCardElements(elements: any[]) {
  return elements.map((el: any) => {
    const style = {
      position: "absolute" as const,
      left: `${el.x}px`,
      top: `${el.y}px`,
      width: `${el.width}px`,
      height: `${el.height}px`,
      transform: `rotate(${el.rotation}deg)`,
      zIndex: el.zIndex,
      fontFamily: el.fontFamily || "inherit",
    }

    if (el.type === "text") {
      return (
        <div key={el.id} style={{ ...style, fontSize: "16px" }}>
          {el.content}
        </div>
      )
    }

    if (el.type === "sticker") {
      const isEmoji = el.src?.includes("text=")
      if (isEmoji) {
        const emojiChar = decodeURIComponent(el.src.split("text=")[1] || "")
        return (
          <div key={el.id} style={{ ...style, fontSize: "28px" }}>
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
    const mime = src.substring(src.indexOf(":" ) + 1, src.indexOf(";"))
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
    console.error("Base64 경복 실패:", e)
    return null
  }
}