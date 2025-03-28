"use client"

import type React from "react"
import type { CardElement as CardElementType } from "@/types/gift-card"
import { CardElement } from "@/components/gift/card-element"
import { Button } from "@/components/ui/button"

interface CardFaceProps {
  isFront: boolean
  isFlipped: boolean
  elements: CardElementType[]
  template: any
  customBackground: string | null
  selectedElementId: string | null
  onSelectElement: (id: string) => void
  onUpdateElement: (element: CardElementType) => void
  onDeleteElement: (id: string) => void
  scale: number
  backgroundInputRef?: React.RefObject<HTMLInputElement>
}

export function CardFace({
  isFront,
  isFlipped,
  elements,
  template,
  customBackground,
  selectedElementId,
  onSelectElement,
  onUpdateElement,
  onDeleteElement,
  scale,
  backgroundInputRef,
}: CardFaceProps) {
  // 배경 이미지 또는 색상 계산
  const backgroundImage =
    template.isCustom && customBackground
      ? customBackground.startsWith("data:")
        ? `url(${customBackground})`
        : customBackground.startsWith("url") || customBackground.startsWith("linear-gradient")
          ? customBackground
          : "none"
      : template.background.startsWith("url") || template.background.startsWith("linear-gradient")
        ? template.background
        : "none"

  const backgroundColor =
    template.isCustom && customBackground
      ? customBackground.startsWith("data:")
        ? "transparent"
        : !customBackground.startsWith("url") && !customBackground.startsWith("linear-gradient")
          ? customBackground
          : "transparent"
      : !template.background.startsWith("url") && !template.background.startsWith("linear-gradient")
        ? template.background
        : "transparent"

  return (
    <div
      className="absolute inset-0 backface-hidden overflow-hidden"
      style={{
        backgroundImage,
        backgroundColor,
        backgroundSize: "cover",
        backgroundPosition: "center",
        transform: isFront
          ? isFlipped
            ? "rotateY(180deg)"
            : "rotateY(0deg)"
          : isFlipped
            ? "rotateY(0deg)"
            : "rotateY(-180deg)",
        visibility: isFront ? (isFlipped ? "hidden" : "visible") : isFlipped ? "visible" : "hidden",
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {/* 사용자 정의 템플릿이 선택되었지만 배경 이미지가 없는 경우 안내 메시지 표시 */}
      {isFront && template.isCustom && !customBackground && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 text-gray-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mb-2"
          >
            <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
            <circle cx="12" cy="13" r="3" />
          </svg>
          <p className="text-center px-4">배경 이미지를 선택해주세요.</p>
          {backgroundInputRef && (
            <Button variant="outline" className="mt-4" onClick={() => backgroundInputRef.current?.click()}>
              배경 이미지 선택
            </Button>
          )}
        </div>
      )}

      {/* 카드 요소들 */}
      {!isFront ? (
        <div className="relative w-full h-full" style={{ transform: "rotateY(180deg)" }}>
          {elements.map((element) => (
            <CardElement
              key={element.id}
              element={element}
              isSelected={isFlipped && selectedElementId === element.id}
              onSelect={() => onSelectElement(element.id)}
              onUpdate={onUpdateElement}
              onDelete={() => onDeleteElement(element.id)}
              isCardFlipped={false}
              scale={scale}
            />
          ))}
        </div>
      ) : (
        elements.map((element) => (
          <CardElement
            key={element.id}
            element={element}
            isSelected={!isFlipped && selectedElementId === element.id}
            onSelect={() => onSelectElement(element.id)}
            onUpdate={onUpdateElement}
            onDelete={() => onDeleteElement(element.id)}
            isCardFlipped={false}
            scale={scale}
          />
        ))
      )}
    </div>
  )
}

