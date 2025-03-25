"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { ArticleGrid } from "@/components/article/article-grid"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { CategoryNavigation } from "@/components/article/category-navigation"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// 간단한 debounce 유틸리티 함수 구현
const debounce = <F extends (...args: any[]) => any>(func: F, waitFor: number) => {
  let timeout: ReturnType<typeof setTimeout> | null = null

  return (...args: Parameters<F>): void => {
    if (timeout !== null) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(() => func(...args), waitFor)
  }
}

// access_token 가져오기
const getAccessToken = () => {
  if (typeof window !== "undefined"){
    return localStorage.getItem("access_token") || null
  }
  return null
}

// 백엔드 API에서 상품 데이터를 가져오는 함수
const fetchArticles = async ({
  categories = [],
  sort = "newest",
  page = 0,
  size = 10,
}: {
  categories?: number[]
  sort?: string
  page?: number
  size?: number
  userId?: number
}) => {
  try {
    const accessToken = getAccessToken()

    // URL 쿼리 파라미터 구성
    const params = new URLSearchParams()

    if (categories.length > 0) {
      categories.forEach((cat) => params.append("category", cat.toString()))
    }

    if (sort) params.append("sort", sort)
    params.append("page", page.toString())
    params.append("size", size.toString())

    const queryString = params.toString()
    const url = `${BASE_URL}/secondhand-articles${queryString ? `?${queryString}` : ""}`

    console.log("Fetching articles from:", url)

    const headers: HeadersInit = { "Content-Type": "application/json" }
    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}` // 로그인한 경우에만 헤더 추가
    }

    const res = await fetch(url, {
      method: "GET", headers
    })

    if (!res.ok) throw new Error("Failed to fetch articles")

    const data = await res.json()
    console.log("API Response:", data)
    return data
  } catch (error) {
    console.error("Error fetching articles:", error)
    return { content: [], totalPages: 1, totalElements: 0 }
  }
}

// 클라이언트 측 필터링 함수
const filterArticles = (articles: any[], searchQuery: string, priceRange: number[]) => {
  return articles.filter((article) => {
    // 검색어 필터링
    if (searchQuery && !article.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }

    // 가격 범위 필터링
    if (article.currentPrice < priceRange[0] || article.currentPrice > priceRange[1]) {
      return false
    }

    return true
  })
}

export function ArticleListing() {
  // 상품 데이터 및 로딩 상태
  const [articles, setArticles] = useState<any[]>([])
  const [filteredArticles, setFilteredArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [totalItems, setTotalItems] = useState(0)

  // 필터링 및 정렬 상태
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState([0, 20000])
  const [showFilters, setShowFilters] = useState(false)
  const [sortOption, setSortOption] = useState("newest")

  // 페이지네이션 상태
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // 사용자 ID (로그인 기능 구현 시 실제 사용자 ID로 대체)
  const [userId, setUserId] = useState<number | undefined>(undefined)

  // 상품 데이터 가져오기
  const loadArticles = useCallback(async () => {
    setLoading(true)

    const fetchedData = await fetchArticles({
      categories: selectedCategories.map(Number),
      sort: sortOption,
      page,
      size: pageSize,
      userId,
    })

    const articlesData = fetchedData.content || []
    console.log("Articles data:", articlesData)

    setArticles(articlesData)
    setFilteredArticles(articlesData) // 초기에는 필터링 없이 모든 상품 표시
    setTotalPages(fetchedData.totalPages || 1)
    setTotalItems(fetchedData.totalElements || 0)
    setLoading(false)
  }, [selectedCategories, sortOption, page, pageSize, userId])

  // 컴포넌트 마운트 시 상품 데이터 로드
  useEffect(() => {
    loadArticles()
  }, [loadArticles])

  // 클라이언트 측 필터링 적용 (검색어와 가격 범위)
  useEffect(() => {
    if (articles.length > 0) {
      if (searchQuery || priceRange[0] > 0 || priceRange[1] < 20000) {
        // 필터가 적용된 경우에만 필터링
        const filtered = filterArticles(articles, searchQuery, priceRange)
        setFilteredArticles(filtered)
      } else {
        // 필터가 없으면 모든 상품 표시
        setFilteredArticles(articles)
      }
    } else {
      setFilteredArticles([])
    }
  }, [articles, searchQuery, priceRange])

  // 디바운스된 가격 범위 변경 핸들러
  const debouncedPriceChange = useCallback(
    debounce((value: number[]) => {
      setPriceRange(value)
    }, 300),
    [],
  )

  // 필터 초기화
  const resetFilters = () => {
    setSelectedCategories([])
    setPriceRange([0, 20000])
    setSearchQuery("")
    setSortOption("newest")
    setPage(0)
    loadArticles() // 필터 초기화 후 상품 다시 로드
  }

  // 카테고리 필터 제거
  const removeCategory = (category: string) => {
    setSelectedCategories(selectedCategories.filter((c) => c !== category))
    setPage(0) // 카테고리 변경 시 첫 페이지로 이동
  }

  // 카테고리 값과 이름 매핑 객체 생성
  const categoryMap: Record<string, string> = {
    "1": "카페",
    "2": "베이커리/도넛/떡",
    "3": "아이스크림/빙수",
    "4": "치킨/피자",
    "5": "패스트푸드",
    "6": "편의점/마트",
  }

  // 검색 제출 핸들러
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // 검색은 클라이언트 측에서 처리
  }

  // 정렬 변경 핸들러
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value)
    setPage(0) // 정렬 변경 시 첫 페이지로 이동
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">전체 상품 보기</h1>
        <p className="text-gray-500">다양한 기프티콘을 합리적인 가격에 만나보세요.</p>
      </div>

      {/* 카테고리 네비게이션 */}
      <CategoryNavigation
        categories={[
          { name: "카페", value: "1" },
          { name: "베이커리/도넛/떡", value: "2" },
          { name: "아이스크림/빙수", value: "3" },
          { name: "치킨/피자", value: "4" },
          { name: "패스트푸드", value: "5" },
          { name: "편의점/마트", value: "6" },
        ]}
        selectedCategories={selectedCategories}
        onCategoryChange={(categories) => {
          setSelectedCategories(categories)
          setPage(0) // 카테고리 변경 시 첫 페이지로 이동
        }}
        className="mb-6"
      />

      {/* 검색 및 필터 영역 */}
      <div className="mb-8 space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
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
          <Button type="submit" variant="default" className="hidden sm:inline-flex">
            검색
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? "bg-primary/10" : ""}
            type="button"
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
        </form>

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
                  onValueChange={debouncedPriceChange}
                  className="py-4"
                />
              </div>
            </div>
          </div>
        )}

        {/* 활성화된 필터 표시 */}
        {(selectedCategories.length > 0 || priceRange[0] > 0 || priceRange[1] < 20000 || searchQuery) && (
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
            {searchQuery && (
              <Badge variant="secondary" className="flex items-center gap-1">
                검색: {searchQuery}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 cursor-pointer"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  onClick={() => setSearchQuery("")}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Badge>
            )}
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
            <Button variant="ghost" size="sm" onClick={resetFilters} className="h-6 text-xs px-2 text-gray-500">
              모두 지우기
            </Button>
          </div>
        )}
      </div>

      {/* 상품 목록 */}
      <div className="mb-4 flex justify-between items-center">
        <p className="text-sm text-gray-500">총 {totalItems}개의 상품</p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">정렬:</span>
          <select className="text-sm border rounded-md px-2 py-1" value={sortOption} onChange={handleSortChange}>
            <option value="newest">최신순</option>
            <option value="highest">높은 가격순</option>
            <option value="lowest">낮은 가격순</option>
            <option value="likes">좋아요순</option>
            <option value="views">조회수순</option>
          </select>
        </div>
      </div>

      {/* 로딩 상태 및 상품 목록 */}
      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : filteredArticles.length > 0 ? (
          <ArticleGrid
              articles={filteredArticles.map(article => ({
                ...article,
                isLiked: article.liked, // liked 값을 isLiked로 변환하여 전달
              }))}
              className="mb-8"
          />
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
      {filteredArticles.length > 0 && totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <nav className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
            >
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

            {/* 페이지 번호 버튼 */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // 현재 페이지 주변의 페이지만 표시
              let pageNum = page
              if (page < 2) {
                pageNum = i
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 5 + i
              } else {
                pageNum = page - 2 + i
              }

              // 페이지 범위 확인
              if (pageNum >= 0 && pageNum < totalPages) {
                return (
                  <Button
                    key={pageNum}
                    variant="outline"
                    size="sm"
                    className={`h-8 w-8 ${pageNum === page ? "bg-primary text-primary-foreground" : ""}`}
                    onClick={() => setPage(pageNum)}
                  >
                    {pageNum + 1}
                  </Button>
                )
              }
              return null
            })}

            {/* 다음 페이지 버튼 */}
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={page >= totalPages - 1}
              onClick={() => setPage(page + 1)}
            >
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

