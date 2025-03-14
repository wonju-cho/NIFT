import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface ProductCardProps {
  id: string
  title: string
  price: number
  originalPrice?: number
  category: string
  image?: string
  location?: string
  distance?: string
  listedAt?: string
  isFavorite?: boolean
  isNew?: boolean
  className?: string
}

export function ProductCard({
  id,
  title,
  price,
  originalPrice,
  category,
  image,
  location,
  distance,
  listedAt,
  isFavorite = false,
  isNew = false,
  className,
}: ProductCardProps) {
  const formattedPrice = new Intl.NumberFormat("ko-KR").format(price)
  const discountRate = originalPrice ? Math.round((1 - price / originalPrice) * 100) : 0

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-lg border bg-white transition-all hover:shadow-md",
        className,
      )}
    >
      <Link href={`/product/${id}`} className="block">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={image || "/placeholder.svg?height=400&width=400"}
            alt={title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 z-10 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm"
            aria-label={isFavorite ? "찜 해제하기" : "찜하기"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={cn("h-4 w-4", isFavorite ? "fill-primary text-primary" : "text-gray-500")}
              fill="none"
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
          {isNew && (
            <div className="absolute left-2 top-2">
              <Badge className="bg-blue-500 hover:bg-blue-600">NEW</Badge>
            </div>
          )}
        </div>
        <div className="p-3">
          <div className="mb-1 text-xs text-gray-500">{category}</div>
          <h3 className="line-clamp-2 text-sm font-medium">{title}</h3>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-base font-bold">{formattedPrice}원</span>
            {discountRate > 0 && <span className="text-xs text-primary">{discountRate}% 할인</span>}
          </div>

          {/* 중고거래 특성에 맞는 위치 및 등록 시간 정보 추가 */}
          <div className="mt-2 flex flex-col gap-1">
            {location && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>{distance ? `${location} · ${distance}` : location}</span>
              </div>
            )}
            {listedAt && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{listedAt}</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  )
}

