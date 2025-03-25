"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const slides = [
  {
    id: 1,
    title: "NFT 기프티콘 중고거래",
    description: "안전하고 빠른 거래로 디지털 자산을 관리하세요",
    image: "/placeholder.svg?height=600&width=1200",
    cta: {
      text: "지금 시작하기",
      link: "/register",
    },
    color: "bg-gradient-to-r from-primary/80 to-primary",
  },
  {
    id: 2,
    title: "내 주변 기프티콘 찾기",
    description: "위치 기반으로 가까운 기프티콘을 찾아보세요",
    image: "/placeholder.svg?height=600&width=1200",
    cta: {
      text: "주변 상품 보기",
      link: "/articles/nearby",
    },
    color: "bg-gradient-to-r from-blue-500/80 to-blue-600",
  },
  {
    id: 3,
    title: "안전한 블록체인 기술",
    description: "투명하고 안전한 거래를 보장합니다",
    image: "/placeholder.svg?height=600&width=1200",
    cta: {
      text: "자세히 알아보기",
      link: "/about",
    },
    color: "bg-gradient-to-r from-purple-500/80 to-purple-600",
  },
]

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
  }

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide()
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative overflow-hidden">
      <div className="relative h-[300px] md:h-[400px] lg:h-[500px] w-full overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={cn(
              "absolute inset-0 flex items-center transition-opacity duration-1000",
              currentSlide === index ? "opacity-100" : "opacity-0 pointer-events-none",
            )}
          >
            <div className={cn("absolute inset-0 z-0", slide.color)} />
            <div className="absolute inset-0 z-0 opacity-20">
              <Image
                src={slide.image || "/placeholder.svg"}
                alt={slide.title}
                fill
                className="object-cover"
                priority={index === 0}
              />
            </div>
            <div className="container relative z-10 flex flex-col items-start justify-center gap-4 text-white">
              <h1 className="max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
                {slide.title}
              </h1>
              <p className="max-w-md text-base md:text-lg lg:text-xl opacity-90">{slide.description}</p>
              <Button size="lg" className="mt-2 bg-white text-primary hover:bg-white/90" asChild>
                <Link href={slide.cta.link}>{slide.cta.text}</Link>
              </Button>
            </div>
          </div>
        ))}
      </div>

      <button
        className="absolute left-4 top-1/2 z-10 h-10 w-10 -translate-y-1/2 rounded-full bg-black/20 text-white backdrop-blur-sm hover:bg-black/30"
        onClick={prevSlide}
        aria-label="이전 슬라이드"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 mx-auto"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        className="absolute right-4 top-1/2 z-10 h-10 w-10 -translate-y-1/2 rounded-full bg-black/20 text-white backdrop-blur-sm hover:bg-black/30"
        onClick={nextSlide}
        aria-label="다음 슬라이드"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 mx-auto"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={cn(
              "h-2 w-2 rounded-full transition-all",
              currentSlide === index ? "w-6 bg-white" : "bg-white/50",
            )}
            onClick={() => setCurrentSlide(index)}
            aria-label={`슬라이드 ${index + 1}로 이동`}
          />
        ))}
      </div>
    </div>
  )
}

