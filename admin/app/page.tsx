"use client"

import type React from "react"

import { useEffect, useState } from "react"
import PageHeader from "@/components/page-header"
import StatsCard from "@/components/stats-card"
import ProductCard from "@/components/product-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Package, ShoppingCart, BadgeDollarSign, Users, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { useProductStore } from "@/lib/store"

export default function Home() {
  const router = useRouter()
  const { products } = useProductStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  // 컴포넌트 마운트 시 초기화
  useEffect(() => {
    // 간단한 로딩 효과
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  // 최근 등록된 상품 4개만 표시
  const recentProducts = products.slice(0, 4)

  // 검색 처리
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      router.push(`/products/search?term=${encodeURIComponent(searchTerm)}`)
    }
  }

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
      <div className="flex justify-between items-center mb-6">
        <PageHeader title="관리자 대시보드" description="NFT 기프티콘샵 관리 시스템에 오신 것을 환영합니다." />
        <Link href="/products/register">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">+ 상품 등록</Button>
        </Link>
      </div>

      <div className="mb-8">
        <form onSubmit={handleSearch} className="relative">
          <Input
            className="pl-10 pr-4 h-12"
            placeholder="상품명, 설명으로 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Button
            type="submit"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            검색
          </Button>
        </form>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatsCard
          title="총 상품"
          value={products.length.toString()}
          icon={<Package className="h-5 w-5" />}
          description="등록된 총 상품 수"
        />
        <StatsCard
          title="일일 판매량"
          value="32"
          icon={<ShoppingCart className="h-5 w-5" />}
          description="지난 주 대비 5% 증가"
        />
        <StatsCard
          title="일일 매출"
          value="₩486,200"
          icon={<BadgeDollarSign className="h-5 w-5" />}
          description="지난 주 대비 12% 증가"
        />
        <StatsCard
          title="총 회원"
          value="1,024"
          icon={<Users className="h-5 w-5" />}
          description="지난 주 대비 3% 증가"
        />
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">최근 등록된 상품</h2>
        <Link href="/products/search" className="text-blue-600 hover:underline text-sm">
          모든 상품 보기 →
        </Link>
      </div>

      {recentProducts.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium">등록된 상품이 없습니다</h3>
          <p className="text-gray-500 mt-2 mb-4">새 상품을 등록해보세요.</p>
          <Link href="/products/register">
            <Button className="bg-blue-600 hover:bg-blue-700 color-white ">+ 상품 등록</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {recentProducts.map((product) => (
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
      )}
    </div>
  )
}

