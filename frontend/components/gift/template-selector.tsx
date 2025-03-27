"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface TemplateSelectorProps {
  isFlipped: boolean
  templates: any[]
  selectedTemplate: any
  customBackground: string | null
  customBackBackground: string | null
  onChangeTemplate: (template: any) => void
  onRemoveBackground: () => void
  backgroundInputRef: React.RefObject<HTMLInputElement>
  backBackgroundInputRef: React.RefObject<HTMLInputElement>
}

export function TemplateSelector({
  isFlipped,
  templates,
  selectedTemplate,
  customBackground,
  customBackBackground,
  onChangeTemplate,
  onRemoveBackground,
  backgroundInputRef,
  backBackgroundInputRef,
}: TemplateSelectorProps) {
  return (
    <div className="flex flex-col space-y-4">
      <h3 className="font-medium">{isFlipped ? "카드 뒷면 템플릿" : "카드 앞면 템플릿"}</h3>

      {/* 템플릿 카테고리 필터 */}
      <div className="flex flex-wrap gap-2 pb-2">
        <button className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary hover:bg-primary/20">전체</button>
        <button className="text-xs px-2 py-1 rounded-full bg-gray-100 hover:bg-gray-200">생일</button>
        <button className="text-xs px-2 py-1 rounded-full bg-gray-100 hover:bg-gray-200">축하</button>
        <button className="text-xs px-2 py-1 rounded-full bg-gray-100 hover:bg-gray-200">감사</button>
        <button className="text-xs px-2 py-1 rounded-full bg-gray-100 hover:bg-gray-200">사랑</button>
        <button className="text-xs px-2 py-1 rounded-full bg-gray-100 hover:bg-gray-200">일반</button>
      </div>

      {/* 템플릿 그리드 */}
      <div className="grid grid-cols-2 gap-2">
        {templates.map((template) => (
          <div
            key={template.id}
            className={cn(
              "cursor-pointer rounded-md overflow-hidden border-2 transition-all hover:shadow-sm relative",
              selectedTemplate.id === template.id ? "border-primary" : "border-transparent",
            )}
            onClick={() => onChangeTemplate(template)}
          >
            {template.isCustom ? (
              <div className="aspect-[4/3] relative bg-gray-100 flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                    <circle cx="12" cy="13" r="3" />
                  </svg>
                </div>
                <span className="text-sm">나만의 사진으로</span>
              </div>
            ) : (
              <div className="aspect-[4/3] relative">
                <div
                  className="w-full h-full"
                  style={{
                    backgroundImage:
                      template.background.startsWith("url") || template.background.startsWith("linear-gradient")
                        ? template.background
                        : "none",
                    backgroundColor:
                      !template.background.startsWith("url") && !template.background.startsWith("linear-gradient")
                        ? template.background
                        : "transparent",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#333",
                  }}
                >
                  {template.name}
                </div>
              </div>
            )}
            <div className="p-1 text-xs text-center truncate">{template.name}</div>

            {/* 선택된 템플릿이 나만의 사진이고 배경이 있는 경우 X 버튼 표시 */}
            {selectedTemplate.id === template.id &&
              template.isCustom &&
              (isFlipped ? customBackBackground && customBackBackground !== "#f8f9fa" : customBackground) && (
                <button
                  className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm hover:bg-gray-100"
                  onClick={(e) => {
                    e.stopPropagation()
                    onRemoveBackground()
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              )}
          </div>
        ))}
      </div>

      {/* 배경 관련 컨트롤 표시 */}
      <div className="mt-4 border rounded-md p-3 bg-white">
        <h4 className="font-medium text-sm mb-2">{isFlipped ? "뒷면 배경 이미지" : "앞면 배경 이미지"}</h4>

        {isFlipped ? (
          // 뒷면 배경 컨트롤
          <div className="space-y-3">
            {/* 배경 미리보기 스타일 수정 */}
            <div className="aspect-[4/3] relative rounded overflow-hidden">
              <div
                className="w-full h-full"
                style={{
                  backgroundImage: customBackBackground
                    ? customBackBackground.startsWith("data:")
                      ? `url(${customBackBackground})`
                      : customBackBackground.startsWith("url") || customBackBackground.startsWith("linear-gradient")
                        ? customBackBackground
                        : "none"
                    : selectedTemplate.background.startsWith("url") ||
                        selectedTemplate.background.startsWith("linear-gradient")
                      ? selectedTemplate.background
                      : "none",
                  backgroundColor: customBackBackground
                    ? customBackBackground.startsWith("data:")
                      ? "transparent"
                      : !customBackBackground.startsWith("url") && !customBackBackground.startsWith("linear-gradient")
                        ? customBackBackground
                        : "transparent"
                    : !selectedTemplate.background.startsWith("url") &&
                        !selectedTemplate.background.startsWith("linear-gradient")
                      ? selectedTemplate.background
                      : "transparent",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              ></div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" onClick={() => backBackgroundInputRef.current?.click()}>
                배경 이미지 변경
              </Button>
              <Button variant="outline" size="sm" onClick={onRemoveBackground}>
                기본으로 변경
              </Button>
            </div>

            {/* 뒷면 배경색 선택 */}
            <div className="mt-2">
              <label className="block text-xs mb-1">배경색 선택</label>
              <div className="grid grid-cols-5 gap-1">
                {[
                  "#f8f9fa",
                  "#e9ecef",
                  "#dee2e6",
                  "#ffe8cc",
                  "#d8f3dc",
                  "#d0f4de",
                  "#e4c1f9",
                  "#ffccd5",
                  "#caffbf",
                ].map((color) => (
                  <button
                    key={color}
                    className={cn(
                      "w-full h-8 rounded border",
                      customBackBackground === color ? "ring-2 ring-primary" : "ring-0",
                    )}
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      // 배경색 변경 로직
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : // 앞면 배경 컨트롤
        selectedTemplate.isCustom ? (
          customBackground ? (
            <div className="space-y-3">
              <div className="aspect-[4/3] relative rounded overflow-hidden">
                <div
                  className="w-full h-full"
                  style={{
                    backgroundImage: `url(${customBackground})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                ></div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="w-full" onClick={() => backgroundInputRef.current?.click()}>
                  배경 이미지 변경
                </Button>
                <Button variant="outline" className="w-full" onClick={onRemoveBackground}>
                  기본으로 변경
                </Button>
              </div>
            </div>
          ) : (
            <Button variant="outline" className="w-full" onClick={() => backgroundInputRef.current?.click()}>
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
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              배경 이미지 선택
            </Button>
          )
        ) : (
          <div className="text-sm text-gray-500 text-center py-2">
            사용자 정의 템플릿을 선택하면 배경 이미지를 변경할 수 있습니다.
          </div>
        )}
      </div>
    </div>
  )
}

