import Link from "next/link"
import { ArticleGrid } from "@/components/article/article-grid"

// 샘플 데이터 - 중고거래 특성에 맞게 위치 정보 추가
const nearbyItems = [
  {
    id: "6",
    title: "투썸플레이스 아메리카노",
    price: 3800,
    originalPrice: 4500,
    category: "커피/음료",
    image: "/placeholder.svg?height=400&width=400",
    location: "서울 강남구",
    distance: "0.5km",
    listedAt: "5시간 전",
  },
  {
    id: "7",
    title: "베스킨라빈스 싱글레귤러",
    price: 3500,
    originalPrice: 4200,
    category: "뷰티/아이스크림",
    image: "/placeholder.svg?height=400&width=400",
    location: "서울 강남구",
    distance: "0.8km",
    listedAt: "6시간 전",
  },
  {
    id: "8",
    title: "버거킹 와퍼 세트",
    price: 8000,
    originalPrice: 9500,
    category: "치킨/피자/버거",
    image: "/placeholder.svg?height=400&width=400",
    location: "서울 강남구",
    distance: "1.2km",
    listedAt: "8시간 전",
  },
  {
    id: "9",
    title: "메가박스 영화 관람권",
    price: 10000,
    originalPrice: 12000,
    category: "문화/생활",
    image: "/placeholder.svg?height=400&width=400",
    location: "서울 강남구",
    distance: "1.5km",
    listedAt: "10시간 전",
  },
  {
    id: "10",
    title: "CU 3천원 금액권",
    price: 2700,
    originalPrice: 3000,
    category: "편의점/마트",
    image: "/placeholder.svg?height=400&width=400",
    location: "서울 강남구",
    distance: "2km",
    listedAt: "12시간 전",
  },
]

export function NearbyItems() {
  return (
    <section className="py-12">
      <div className="container">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-primary"
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">내 주변 상품</h2>
          </div>
          <Link
            href="/articles/nearby"
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
        {/* <ArticleGrid articles={nearbyItems} /> */}
      </div>
    </section>
  )
}

