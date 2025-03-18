"use client"

import { useState } from "react"
import { ProductGrid } from "@/components/product/product-grid"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { CategoryNavigation } from "@/components/product/category-navigation"

// 샘플 데이터 - 실제 구현에서는 API에서 가져올 것
const sampleProducts = [
  {
    id: "1",
    title: "스타벅스 아메리카노 Tall",
    price: 4500,
    category: "커피/음료",
    image: "/placeholder.svg?height=400&width=400",
    location: "서울 강남구",
    listedAt: "10분 전",
  },
  {
    id: "2",
    title: "배스킨라빈스 파인트",
    price: 9800,
    category: "뷰티/아이스크림",
    image: "/placeholder.svg?height=400&width=400",
    location: "서울 송파구",
    listedAt: "30분 전",
  },
  {
    id: "3",
    title: "맥도날드 빅맥 세트",
    price: 8900,
    category: "치킨/피자/버거",
    image: "/placeholder.svg?height=400&width=400",
    location: "서울 마포구",
    listedAt: "1시간 전",
    isNew: true,
  },
  {
    id: "4",
    title: "CGV 영화 관람권",
    price: 13000,
    category: "문화/생활",
    image: "/placeholder.svg?height=400&width=400",
    location: "서울 중구",
    listedAt: "2시간 전",
  },
  {
    id: "5",
    title: "GS25 5천원 금액권",
    price: 5000,
    category: "편의점/마트",
    image: "/placeholder.svg?height=400&width=400",
    location: "서울 용산구",
    listedAt: "3시간 전",
  },
  {
    id: "6",
    title: "투썸플레이스 아메리카노",
    price: 3800,
    category: "커피/음료",
    image: "/placeholder.svg?height=400&width=400",
    location: "서울 강남구",
    listedAt: "5시간 전",
  },
  {
    id: "7",
    title: "베스킨라빈스 싱글레귤러",
    price: 3500,
    category: "뷰티/아이스크림",
    image: "/placeholder.svg?height=400&width=400",
    location: "서울 강남구",
    listedAt: "6시간 전",
  },
  {
    id: "8",
    title: "버거킹 와퍼 세트",
    price: 8000,
    category: "치킨/피자/버거",
    image: "/placeholder.svg?height=400&width=400",
    location: "서울 강남구",
    listedAt: "8시간 전",
  },
  {
    id: "9",
    title: "메가박스 영화 관람권",
    price: 10000,
    category: "문화/생활",
    image: "/placeholder.svg?height=400&width=400",
    location: "서울 강남구",
    listedAt: "10시간 전",
  },
  {
    id: "10",
    title: "CU 3천원 금액권",
    price: 2700,
    category: "편의점/마트",
    image: "/placeholder.svg?height=400&width=400",
    location: "서울 강남구",
    listedAt: "12시간 전",
  },
  {
    id: "11",
    title: "이디야 카페라떼",
    price: 4200,
    category: "커피/음료",
    image: "/placeholder.svg?height=400&width=400",
    location: "서울 서초구",
    listedAt: "1일 전",
  },
  {
    id: "12",
    title: "롯데시네마 영화 관람권",
    price: 11000,
    category: "문화/생활",
    image: "/placeholder.svg?height=400&width=400",
    location: "서울 영등포구",
    listedAt: "1일 전",
  },
]

// 카테고리 배열
const categories = [
  { name: "베이커리/도넛/떡", value: "bakery" },
  { name: "카페", value: "cafe" },
  { name: "아이스크림/빙수", value: "icecream" },
  { name: "치킨", value: "chicken" },
  { name: "버거/피자", value: "burger" },
  { name: "편의점", value: "convenience" },
  { name: "한식/중식/일식", value: "asian" },
  { name: "패밀리/호텔뷔페", value: "buffet" },
  { name: "퓨전/외국/팝", value: "fusion" },
  { name: "분식/족/도시락", value: "snack" },
  { name: "와인/양주/맥주", value: "alcohol" },
]

// 카테고리 값과 이름 매핑 객체 생성
const categoryMap = categories.reduce(
  (acc, category) => {
    acc[category.value] = category.name
    return acc
  },
  {} as Record<string, string>,
)

export function ProductListing() {
  const [searchQuery, setSearchQuery] = useState("")
  // 단일 카테고리 선택에서 다중 선택으로 변경
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState([0, 20000])
  const [showFilters, setShowFilters] = useState(false)
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  // 필터 추가/제거 함수
  const toggleFilter = (filter: string) => {
    if (activeFilters.includes(filter)) {
      setActiveFilters(activeFilters.filter((f) => f !== filter))
    } else {
      setActiveFilters([...activeFilters, filter])
    }
  }

  // 필터 초기화 함수
  const resetFilters = () => {
    setSelectedCategories([])
    setPriceRange([0, 20000])
    setActiveFilters([])
  }

  // 카테고리 필터 제거 함수
  const removeCategory = (category: string) => {
    setSelectedCategories(selectedCategories.filter((c) => c !== category))
  }

  // 필터링된 상품 목록
  const filteredProducts = sampleProducts.filter((product) => {
    // 검색어 필터링
    if (searchQuery && !product.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }

    // 카테고리 필터링 - 선택된 카테고리가 없으면 모든 상품 표시
    if (selectedCategories.length > 0) {
      // 선택된 카테고리 중 하나라도 일치하는지 확인
      const matchesCategory = selectedCategories.some((categoryValue) => {
        const categoryName = categoryMap[categoryValue]
        return product.category === categoryName
      })

      if (!matchesCategory) {
        return false
      }
    }

    // 가격 범위 필터링
    if (product.price < priceRange[0] || product.price > priceRange[1]) {
      return false
    }

    // 활성화된 필터 적용
    if (activeFilters.includes("new") && !product.isNew) {
      return false
    }

    return true
  })

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">전체 상품 보기</h1>
        <p className="text-gray-500">다양한 기프티콘을 합리적인 가격에 만나보세요.</p>
      </div>

      {/* 카테고리 네비게이션 바 */}
      <CategoryNavigation
        categories={categories}
        selectedCategories={selectedCategories}
        onCategoryChange={setSelectedCategories}
        className="mb-6"
      />

      {/* 검색 및 필터 영역 */}
      <div className="mb-8 space-y-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <Input
              type="search"
              placeholder="상품명으로 검색..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? "bg-primary/10" : ""}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              />
            </svg>
          </Button>
        </div>

        {/* 필터 영역 */}
        {showFilters && (
          <div className="bg-gray-50 rounded-lg p-4 border">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">필터</h3>
              <Button variant="ghost" size="sm" onClick={resetFilters} className="h-8 text-xs">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                초기화
              </Button>
            </div>

            <div className="space-y-4">
              {/* 가격 범위 필터 */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-medium">가격 범위</h4>
                  <span className="text-xs text-gray-500">
                    {priceRange[0].toLocaleString()}원 - {priceRange[1].toLocaleString()}원
                  </span>
                </div>
                <Slider
                  defaultValue={[0, 20000]}
                  min={0}
                  max={20000}
                  step={1000}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="py-4"
                />
              </div>

              {/* 추가 필터 */}
              <div>
                <h4 className="text-sm font-medium mb-2">추가 필터</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant={activeFilters.includes("new") ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleFilter("new")}
                  >
                    신규 등록
                  </Badge>
                  <Badge
                    variant={activeFilters.includes("discount") ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleFilter("discount")}
                  >
                    할인 상품
                  </Badge>
                  <Badge
                    variant={activeFilters.includes("nearby") ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleFilter("nearby")}
                  >
                    내 주변
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 활성화된 필터 표시 */}
        {(selectedCategories.length > 0 || priceRange[0] > 0 || priceRange[1] < 20000 || activeFilters.length > 0) && (
          <div className="flex flex-wrap gap-2">
            {selectedCategories.map((categoryValue) => (
              <Badge key={categoryValue} variant="secondary" className="flex items-center gap-1">
                {categoryMap[categoryValue]}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 cursor-pointer"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  onClick={() => removeCategory(categoryValue)}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Badge>
            ))}
            {(priceRange[0] > 0 || priceRange[1] < 20000) && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {priceRange[0].toLocaleString()}원-{priceRange[1].toLocaleString()}원
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 cursor-pointer"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  onClick={() => setPriceRange([0, 20000])}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Badge>
            )}
            {activeFilters.map((filter) => (
              <Badge key={filter} variant="secondary" className="flex items-center gap-1">
                {filter === "new" ? "신규 등록" : filter === "discount" ? "할인 상품" : "내 주변"}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 cursor-pointer"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  onClick={() => toggleFilter(filter)}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Badge>
            ))}
            <Button variant="ghost" size="sm" onClick={resetFilters} className="h-6 text-xs px-2 text-gray-500">
              모두 지우기
            </Button>
          </div>
        )}
      </div>

      {/* 상품 목록 */}
      <div className="mb-4 flex justify-between items-center">
        <p className="text-sm text-gray-500">총 {filteredProducts.length}개의 상품</p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">정렬:</span>
          <select className="text-sm border rounded-md px-2 py-1">
            <option>최신순</option>
            <option>가격 낮은순</option>
            <option>가격 높은순</option>
            <option>인기순</option>
          </select>
        </div>
      </div>

      {filteredProducts.length > 0 ? (
        <ProductGrid products={filteredProducts} className="mb-8" />
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 rounded-full bg-gray-100 p-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <h3 className="mb-2 text-xl font-semibold">검색 결과가 없습니다</h3>
          <p className="mb-6 text-gray-500">다른 검색어나 필터를 사용해 보세요.</p>
          <Button onClick={resetFilters}>필터 초기화</Button>
        </div>
      )}

      {/* 페이지네이션 */}
      {filteredProducts.length > 0 && (
        <div className="flex justify-center mt-8">
          <nav className="flex items-center gap-1">
            <Button variant="outline" size="icon" className="h-8 w-8" disabled>
              <span className="sr-only">이전 페이지</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Button>
            <Button variant="outline" size="sm" className="h-8 w-8 bg-primary text-primary-foreground">
              1
            </Button>
            <Button variant="outline" size="sm" className="h-8 w-8">
              2
            </Button>
            <Button variant="outline" size="sm" className="h-8 w-8">
              3
            </Button>
            <Button variant="outline" size="sm" className="h-8 w-8">
              ...
            </Button>
            <Button variant="outline" size="sm" className="h-8 w-8">
              12
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <span className="sr-only">다음 페이지</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          </nav>
        </div>
      )}
    </div>
  )
}

