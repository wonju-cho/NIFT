import Link from "next/link"
import { ProductGrid } from "@/components/product/product-grid"

// 샘플 데이터 - 중고거래 특성에 맞게 수정
const recentlyListedProducts = [
  {
    id: "1",
    title: "스타벅스 아메리카노 Tall",
    price: 4000,
    originalPrice: 4500,
    category: "커피/음료",
    image: "/placeholder.svg?height=400&width=400",
    location: "서울 강남구",
    listedAt: "10분 전",
  },
  {
    id: "2",
    title: "배스킨라빈스 파인트",
    price: 8500,
    originalPrice: 9800,
    category: "뷰티/아이스크림",
    image: "/placeholder.svg?height=400&width=400",
    location: "서울 송파구",
    listedAt: "30분 전",
  },
  {
    id: "3",
    title: "맥도날드 빅맥 세트",
    price: 7500,
    originalPrice: 8900,
    category: "치킨/피자/버거",
    image: "/placeholder.svg?height=400&width=400",
    location: "서울 마포구",
    listedAt: "1시간 전",
    isNew: true,
  },
  {
    id: "4",
    title: "CGV 영화 관람권",
    price: 11000,
    originalPrice: 13000,
    category: "문화/생활",
    image: "/placeholder.svg?height=400&width=400",
    location: "서울 중구",
    listedAt: "2시간 전",
  },
  {
    id: "5",
    title: "GS25 5천원 금액권",
    price: 4500,
    originalPrice: 5000,
    category: "편의점/마트",
    image: "/placeholder.svg?height=400&width=400",
    location: "서울 용산구",
    listedAt: "3시간 전",
  },
]

export function RecentlyListed() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">최근 등록된 상품</h2>
          <Link
            href="/products/recent"
            className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            더 보기{" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
        {/* <ProductGrid products={recentlyListedProducts} /> */}
      </div>
    </section>
  )
}

