"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import PageHeader from "@/components/page-header"
import ProductCard from "@/components/product-card"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, X, Package, Download, Calendar, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useProductStore } from "@/lib/store"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function ProductSearch() {
  const searchParams = useSearchParams()
  const initialTerm = searchParams.get("term") || ""
  const { products, getCategories, getBrands, filterProducts } = useProductStore()

  // 상태 관리
  const [searchTerm, setSearchTerm] = useState(initialTerm)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedBrand, setSelectedBrand] = useState<string>("all")
  const [filteredProducts, setFilteredProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [brands, setBrands] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(true)
  const [hasSearched, setHasSearched] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "table">("table") // 기본값을 테이블로 변경
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [orderStatus, setOrderStatus] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  // 초기 데이터 로드 및 필터링
  useEffect(() => {
    // 카테고리 목록 추출
    setCategories(getCategories())

    // 브랜드 목록 추출
    setBrands(getBrands())

    // 초기 검색어가 있으면 필터링
    if (initialTerm) {
      const filtered = filterProducts(selectedCategory, selectedBrand, initialTerm)
      setFilteredProducts(filtered)
      setHasSearched(true)
    } else {
      setFilteredProducts(products)
    }

    // 로딩 완료
    setTimeout(() => {
      setIsLoading(false)
    }, 500)
  }, [products, initialTerm, getCategories, getBrands, filterProducts, selectedCategory, selectedBrand])

  // 필터링 로직
  const applyFilters = () => {
    const filtered = filterProducts(
      selectedCategory !== "all" ? selectedCategory : undefined,
      selectedBrand !== "all" ? selectedBrand : undefined,
      searchTerm,
    )
    setFilteredProducts(filtered)
    setHasSearched(true)
  }

  // 필터 초기화
  const resetFilters = () => {
    setSearchTerm("")
    setSelectedCategory("all")
    setSelectedBrand("all")
    setStartDate("")
    setEndDate("")
    setOrderStatus("all")
    setFilteredProducts(products)
    setHasSearched(false)
  }

  // 검색 실행
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    applyFilters()
  }

  // 활성 필터 수 계산
  const activeFiltersCount =
    (selectedCategory !== "all" ? 1 : 0) +
    (selectedBrand !== "all" ? 1 : 0) +
    (searchTerm ? 1 : 0) +
    (startDate ? 1 : 0) +
    (endDate ? 1 : 0) +
    (orderStatus !== "all" ? 1 : 0)

  // 로딩 상태 표시
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-500">데이터를 불러오는 중입니다...</p>
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="상품 검색" description="등록된 NFT 기프티콘 상품을 검색합니다." />

      <Card className="mb-6">
        <CardContent className="pt-6">
          <form onSubmit={handleSearch}>
            <div className="flex flex-col gap-4">
              {/* 검색 입력 필드 */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    className="pl-10 pr-4"
                    placeholder="상품번호, 상품명, 상품 설명 등 검색어를 입력하세요"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                  검색
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="relative"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  필터
                  {activeFiltersCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      {activeFiltersCount}
                    </span>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setViewMode(viewMode === "grid" ? "table" : "grid")}
                >
                  {viewMode === "grid" ? "테이블 보기" : "그리드 보기"}
                </Button>
              </div>

              {/* 필터 영역 */}
              {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2 p-4 bg-gray-50 rounded-md">
                  {/* 카테고리 필터 */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">카테고리</label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="전체" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all" className="bg-white">전체</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category} className="bg-white">
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* 브랜드 필터 */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">브랜드</label>
                    <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                      <SelectTrigger>
                        <SelectValue placeholder="전체" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all" className="bg-white">전체</SelectItem>
                        {brands.map((brand) => (
                          <SelectItem key={brand} value={brand} className="bg-white">
                            {brand}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* 주문 상태 필터 */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">주문 상태</label>
                    <Select value={orderStatus} onValueChange={setOrderStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder="전체" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all" className="bg-white">전체</SelectItem>
                        <SelectItem value="waiting" className="bg-white">대기중</SelectItem>
                        <SelectItem value="processing" className="bg-white">처리중</SelectItem>
                        <SelectItem value="completed" className="bg-white">완료</SelectItem>
                        <SelectItem value="canceled" className="bg-white">취소됨</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* 기간 필터 */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium">기간 선택</label>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <Input
                          type="date"
                          className="pl-10"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                        />
                      </div>
                      <span className="text-gray-500">~</span>
                      <div className="relative flex-1">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <Input
                          type="date"
                          className="pl-10"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* 필터 초기화 버튼 */}
                  <div className="flex justify-end items-end">
                    <Button variant="outline" size="sm" onClick={resetFilters}>
                      <X className="h-4 w-4 mr-2" />
                      필터 초기화
                    </Button>
                  </div>
                </div>
              )}

              {/* 활성 필터 표시 */}
              {activeFiltersCount > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {searchTerm && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      검색어: {searchTerm}
                      <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => setSearchTerm("")} />
                    </Badge>
                  )}
                  {selectedCategory !== "all" && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      카테고리: {selectedCategory}
                      <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => setSelectedCategory("all")} />
                    </Badge>
                  )}
                  {selectedBrand !== "all" && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      브랜드: {selectedBrand}
                      <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => setSelectedBrand("all")} />
                    </Badge>
                  )}
                  {orderStatus !== "all" && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      주문상태: {orderStatus}
                      <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => setOrderStatus("all")} />
                    </Badge>
                  )}
                  {startDate && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      시작일: {startDate}
                      <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => setStartDate("")} />
                    </Badge>
                  )}
                  {endDate && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      종료일: {endDate}
                      <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => setEndDate("")} />
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* 검색 결과 헤더 */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">
          {hasSearched ? `검색 결과: ${filteredProducts.length}개` : `전체 상품: ${products.length}개`}
        </h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            엑셀 다운로드
          </Button>
          {filteredProducts.length > 0 && <div className="text-sm text-gray-500">최신순으로 정렬됨</div>}
        </div>
      </div>

      {/* 검색 결과 표시 */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium">{hasSearched ? "검색 결과가 없습니다" : "등록된 상품이 없습니다"}</h3>
          <p className="text-gray-500 mt-2 mb-4">
            {hasSearched ? "다른 검색어나 필터를 사용해보세요." : "새 상품을 등록해보세요."}
          </p>
          {hasSearched ? (
            <Button variant="outline" onClick={resetFilters}>
              모든 상품 보기
            </Button>
          ) : (
            <Link href="/products/register">
              <Button className="bg-blue-600 hover:bg-blue-700">+ 상품 등록</Button>
            </Link>
          )}
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              image={product.image}
              category={product.category}
              brand={product.brand}
            />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12 text-center">번호</TableHead>
                <TableHead>주문번호</TableHead>
                <TableHead>상품번호</TableHead>
                <TableHead>상품명/브랜드</TableHead>
                <TableHead className="text-right">금액</TableHead>
                <TableHead>구매자</TableHead>
                <TableHead>주문일시</TableHead>
                <TableHead>주문상태</TableHead>
                <TableHead className="text-center">관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product, index) => (
                <TableRow key={product.id}>
                  <TableCell className="text-center">{index + 1}</TableCell>
                  <TableCell>ORD{Math.floor(Math.random() * 10000000)}</TableCell>
                  <TableCell>NFT{product.id.padStart(8, "0")}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-gray-500">{product.brand}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">₩{product.price.toLocaleString()}</TableCell>
                  <TableCell>구매자{Math.floor(Math.random() * 100)}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1 text-gray-400" />
                      <span>{product.createdAt} 12:00</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        index % 4 === 0
                          ? "destructive"
                          : index % 4 === 1
                            ? "default"
                            : index % 4 === 2
                              ? "secondary"
                              : "outline"
                      }
                    >
                      {index % 4 === 0 ? "취소됨" : index % 4 === 1 ? "처리중" : index % 4 === 2 ? "완료" : "대기중"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-2">
                      <Link href={`/products/${product.id}`}>
                        <Button variant="outline" size="sm">
                          보기
                        </Button>
                      </Link>
                      <Link href={`/products/edit/${product.id}`}>
                        <Button variant="outline" size="sm">
                          수정
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* 페이지네이션 */}
          <div className="flex items-center justify-between mt-4 py-4">
            <div className="text-sm text-gray-500">
              총 {filteredProducts.length}개 항목 중 1-{Math.min(10, filteredProducts.length)}개 표시
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled>
                이전
              </Button>
              <Button variant="outline" size="sm" className="bg-blue-50">
                1
              </Button>
              <Button variant="outline" size="sm">
                2
              </Button>
              <Button variant="outline" size="sm">
                3
              </Button>
              <span>...</span>
              <Button variant="outline" size="sm">
                다음
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

