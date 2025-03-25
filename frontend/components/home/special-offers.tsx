import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { ProductGrid } from "@/components/article/article-grid"

// 샘플 데이터
const specialOffers = [
  {
    id: "1",
    title: "스타벅스 아메리카노 Tall",
    price: 4500,
    category: "커피/음료",
    image: "/placeholder.svg?height=400&width=400",
    discount: 10,
    isHot: true,
  },
  {
    id: "2",
    title: "배스킨라빈스 파인트",
    price: 9800,
    category: "뷰티/아이스크림",
    image: "/placeholder.svg?height=400&width=400",
    discount: 15,
  },
  {
    id: "3",
    title: "맥도날드 빅맥 세트",
    price: 8900,
    category: "치킨/피자/버거",
    image: "/placeholder.svg?height=400&width=400",
    discount: 12,
    isNew: true,
  },
  {
    id: "4",
    title: "CGV 영화 관람권",
    price: 13000,
    category: "문화/생활",
    image: "/placeholder.svg?height=400&width=400",
    discount: 20,
    isHot: true,
  },
  {
    id: "5",
    title: "GS25 5천원 금액권",
    price: 5000,
    category: "편의점/마트",
    image: "/placeholder.svg?height=400&width=400",
    discount: 5,
  },
]

export function SpecialOffers() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">특별 할인</h2>
          <Link
            href="/products/special"
            className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            더 보기 <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {/* <ProductGrid products={specialOffers} /> */}
      </div>
    </section>
  )
}

