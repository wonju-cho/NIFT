"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Calendar, CreditCard, Package, Tag } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import PageHeader from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useProductStore } from "@/lib/store"
import type { Product } from "@/lib/store"

export default function ProductDetail({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { getProduct } = useProductStore()
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    console.log("Product detail page - ID:", params.id)

    // 상품 데이터 로드
    const loadProduct = () => {
      // 상품 ID로 상품 찾기
      const foundProduct = getProduct(params.id)
      console.log("Found product:", foundProduct)

      if (foundProduct) {
        setProduct(foundProduct)
        setError(null)
      } else {
        setProduct(null)
        setError("상품을 찾을 수 없습니다")

        // 3초 후 검색 페이지로 리다이렉트
        setTimeout(() => {
          router.push("/products/search")
        }, 3000)
      }

      setIsLoading(false)
    }

    // 로딩 효과를 위한 타임아웃
    const timer = setTimeout(() => {
      loadProduct()
    }, 500)

    return () => clearTimeout(timer)
  }, [params.id, router, getProduct])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium">{error}</h3>
        <p className="text-gray-500 mt-2 mb-4">잠시 후 검색 페이지로 이동합니다.</p>
        <Link href="/products/search">
          <Button variant="outline">지금 이동하기</Button>
        </Link>
      </div>
    )
  }

  if (!product) {
    return null
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Link href="/products/search">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <PageHeader title="상품 상세" description="NFT 기프티콘 상품의 상세 정보입니다." />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <div className="relative h-80 w-full mb-4 overflow-hidden rounded-md">
              <Image
                src={product.image || "/placeholder.svg?height=200&width=200"}
                alt={product.name}
                fill
                className="object-contain"
              />
            </div>
            <div className="mt-4 space-y-4">
              <h3 className="text-lg font-medium">NFT 정보</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-500 mb-1">블록체인</div>
                  <div>{product.nftDetails.blockchain}</div>
                </div>
                <div>
                  <div className="text-gray-500 mb-1">토큰 ID</div>
                  <div className="truncate">{product.nftDetails.tokenId}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-gray-500 mb-1">컨트랙트 주소</div>
                  <div className="truncate font-mono text-xs">{product.nftDetails.contract}</div>
                </div>
                <div>
                  <div className="text-gray-500 mb-1">발행일</div>
                  <div>{product.nftDetails.minted}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
            <div className="flex items-center text-2xl font-bold text-blue-600 mb-4">
              ₩{product.price.toLocaleString()}
            </div>

            <div className="space-y-4">
              <div className="border-t pt-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-blue-600" />
                    <span className="text-gray-500">카테고리:</span> {product.category}
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-blue-600" />
                    <span className="text-gray-500">브랜드:</span> {product.brand}
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-blue-600" />
                    <span className="text-gray-500">재고:</span> {product.stock}개
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span className="text-gray-500">유효기간:</span> {product.validity}
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-blue-600" />
                    <span className="text-gray-500">생성일:</span> {product.createdAt}
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-lg font-medium mb-2">상품 설명</h3>
                <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
              </div>
            </div>

            <div className="flex justify-end mt-6 gap-4">
              <Link href={`/products/search`}>
                <Button variant="outline">목록으로</Button>
              </Link>
              <Link href={`/products/edit/${product.id}`}>
                <Button className="bg-red-500 hover:bg-red-600 text-white">수정</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

