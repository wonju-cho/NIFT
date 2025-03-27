"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ImageHandler } from "@/app/gift/[id]/customize/image-handler"
import type { CardElement as CardElementType } from "@/types/gift-card"

// 사용 가능한 글꼴 목록 정의
const fontOptions = [
  { name: "기본", value: "inherit" },
  { name: "명조체", value: "'Noto Serif KR', serif" },
  { name: "고딕체", value: "'Noto Sans KR', sans-serif" },
  { name: "손글씨", value: "'Gaegu', cursive" },
  { name: "둥근체", value: "'Jua', sans-serif" },
]

interface ToolsPanelProps {
  isFlipped: boolean
  selectedElement: CardElementType | undefined
  editingTextContent: string
  onAddImage: (imageData: string) => void
  onAddText: () => void
  onTextContentChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onFontChange: (fontFamily: string) => void
  onDeleteElement: (id: string) => void
  textInputRef: React.RefObject<HTMLInputElement>
  editorRef: React.RefObject<HTMLDivElement>
}

export function ToolsPanel({
  isFlipped,
  selectedElement,
  editingTextContent,
  onAddImage,
  onAddText,
  onTextContentChange,
  onFontChange,
  onDeleteElement,
  textInputRef,
  editorRef,
}: ToolsPanelProps) {
  return (
    <div className="flex flex-col space-y-4">
      <h3 className="font-medium">{isFlipped ? "뒷면 도구" : "앞면 도구"}</h3>
      <div className="grid gap-3">
        <ImageHandler onImageSelected={onAddImage} buttonText="사진 추가" />

        <Button variant="outline" className="justify-start" onClick={onAddText}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="4 7 4 4 20 4 20 7" />
            <line x1="9" y1="20" x2="15" y2="20" />
            <line x1="12" y1="4" x2="12" y2="20" />
          </svg>
          텍스트 추가
        </Button>

        {selectedElement && (
          <div
            ref={editorRef}
            className="border rounded-md p-3 mt-4"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
          >
            <h4 className="font-medium text-sm mb-2">선택된 요소 편집</h4>

            {/* 텍스트 요소가 선택된 경우 텍스트 편집 UI 표시 */}
            {selectedElement.type === "text" && (
              <div className="space-y-3">
                {/* 글꼴 선택 버튼 */}
                <div className="mb-3">
                  <label className="block text-xs mb-1">글꼴 선택</label>
                  <div className="grid grid-cols-5 gap-1">
                    {fontOptions.map((font) => (
                      <button
                        key={font.value}
                        type="button"
                        className={cn(
                          "text-xs px-2 py-1 border rounded hover:bg-gray-100",
                          selectedElement.fontFamily === font.value
                            ? "border-primary bg-primary/10"
                            : "border-gray-200",
                        )}
                        style={{ fontFamily: font.value }}
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          onFontChange(font.value)
                        }}
                      >
                        {font.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="text-content" className="block text-xs mb-1">
                    텍스트 내용
                  </label>
                  <div className="flex gap-2">
                    <Input
                      id="text-content"
                      ref={textInputRef}
                      value={editingTextContent}
                      onChange={onTextContentChange}
                      onClick={(e) => e.stopPropagation()}
                      onMouseDown={(e) => e.stopPropagation()}
                      onTouchStart={(e) => e.stopPropagation()}
                      className="text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            <Button
              variant="destructive"
              size="sm"
              className="w-full"
              onClick={(e) => {
                e.stopPropagation()
                onDeleteElement(selectedElement.id)
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                <line x1="10" y1="11" x2="10" y2="17" />
                <line x1="14" y1="11" x2="14" y2="17" />
              </svg>
              삭제하기
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

