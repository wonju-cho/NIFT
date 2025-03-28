"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ImageCompressor } from "../image-compressor"

interface ImageHandlerProps {
  onImageSelected: (imageData: string) => void
  buttonText?: string
  variant?: "default" | "outline" | "secondary" | "destructive" | "ghost" | "link"
}

export function ImageHandler({ onImageSelected, buttonText = "이미지 추가", variant = "outline" }: ImageHandlerProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleImageCompressed = (compressedImage: string) => {
    // 이미지 유효성 검사
    if (!compressedImage.startsWith("data:image/")) {
      console.error("유효하지 않은 이미지 형식:", compressedImage.substring(0, 30))
      alert("이미지 형식이 올바르지 않습니다. 다른 이미지를 선택해주세요.")
      return
    }

    // 이미지 미리 로드하여 유효성 확인
    const img = new Image()
    img.onload = () => {
      console.log("이미지 로드 성공:", img.width, "x", img.height)
      console.log("이미지 선택됨:", compressedImage.substring(0, 50) + "...")
      onImageSelected(compressedImage)
      setIsOpen(false)
    }

    img.onerror = () => {
      console.error("이미지 로드 실패")
      alert("이미지를 로드할 수 없습니다. 다른 이미지를 선택해주세요.")
    }

    img.src = compressedImage
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} className="justify-start w-full">
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
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <ImageCompressor onImageCompressed={handleImageCompressed} onCancel={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}

