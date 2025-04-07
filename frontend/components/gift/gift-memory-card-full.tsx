"use client"

import Image from "next/image"

const CARD_WIDTH = 400
const CARD_HEIGHT = 600

interface GiftMemoryCardFullViewProps {
  cardData: {
    frontTemplate: { background: string }
    backTemplate: { background: string }
    frontElements: any[]
    backElements: any[]
  }
  isBack?: boolean
}

export function GiftMemoryCardFullView({ cardData, isBack = false }: GiftMemoryCardFullViewProps) {
  const background = isBack ? cardData.backTemplate.background : cardData.frontTemplate.background
  const elements = isBack ? cardData.backElements : cardData.frontElements

  return (
    <div
      className="relative rounded-lg overflow-hidden"
      style={{
        width: `${CARD_WIDTH}px`,
        height: `${CARD_HEIGHT}px`,
      }}
    >
      {/* 배경 */}
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

      {/* 요소들 */}
      {elements.map((el: any) => {
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
      })}
    </div>
  )
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
    console.error("Base64 변환 실패:", e)
    return null
  }
}
