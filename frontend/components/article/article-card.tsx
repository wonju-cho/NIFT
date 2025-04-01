"use client";

import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ArticleService } from "@/lib/api/ArticleService";
import {useState} from "react";

export interface ArticleCardProps {
  articleId: number
  title: string
  brandName: string
  currentPrice: number
  originalPrice: number
  discountRate: number
  imageUrl: string
  isLiked?: boolean
  className?: string
}

export function ArticleCard({
  articleId,
  title,
  brandName,
  currentPrice,
  originalPrice,
  discountRate,
  imageUrl,
  isLiked: initialIsLiked,
  className,
}: ArticleCardProps) {
  // console.log(`🔍 ArticleCard - 상품 ID: ${articleId}, isLiked: ${isLiked}`);

  const formattedCurrentPrice = new Intl.NumberFormat("ko-KR").format(currentPrice)
  const formattedOriginalPrice = new Intl.NumberFormat("ko-KR").format(originalPrice)

  const [isLiked, setIsLiked] = useState(initialIsLiked ?? false);

  // 이미지 URL 처리 - 외부 URL이면 placeholder 사용
  const imageSrc = imageUrl || "/placeholder.svg?height=400&width=400";

  // 좋아요 관리
  const handleLikeToggle = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault(); // 링크 이동 방지
    setIsLiked((prev) => !prev); // UI 즉시 변경

    const success = await ArticleService.toggleLike(articleId, isLiked);
    if (!success) {
      setIsLiked((prev) => !prev); // 요청 실패 시 롤백
    }
  }

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-lg border bg-white transition-all hover:shadow-md",
        className,
      )}
    >
      <Link href={`/article/${articleId}`} className="block">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={imageSrc}
            alt={title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 z-10 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm"
              aria-label={isLiked ? "찜 해제하기" : "찜하기"}
              onClick={handleLikeToggle}
          >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className={cn("h-4 w-4", isLiked ? "fill-red-500 text-red-500" : "text-gray-500")}
                fill={isLiked ? "currentColor" : "none"}
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
              <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </Button>
        </div>
        <div className="p-3">
          <div className="mb-1 text-xs text-gray-500">{brandName}</div>
          <h3 className="line-clamp-2 text-sm font-medium">{title}</h3>
          <div className="mt-2 flex items-baseline gap-1">
            {discountRate > 0 && <span className="text-sm text-red-500">~{discountRate}%</span>}
            <span className="text-base font-bold">{formattedCurrentPrice}</span>
            {originalPrice > currentPrice && (
              <span className="text-xs text-gray-500 line-through">{formattedOriginalPrice}</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  )
}

