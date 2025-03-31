"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import PageHeader from "@/components/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useProductStore } from "@/lib/store"

export default function ProductEdit({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const { getProduct, updateProduct } = useProductStore()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  // 폼 상태
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    brand: "",
    stock: "",
    validity: "",
    description: "",
    image: "",
    nftDetails: {
      blockchain: "",
      tokenId: "",
      contract: "",
      minted: "",
    },
  })

  useEffect(() => {
    // 상품 데이터 로드
    const loadProduct = () => {
      // 상품 ID로 상품 찾기
      const product = getProduct(params.id)

      if (product) {
        setFormData({
          name: product.name,
          price: product.price.toString(),
          category: product.category,
          brand: product.brand,
          stock: product.stock.toString(),
          validity: product.validity,
          description: product.description,
          image: product.image,
          nftDetails: product.nftDetails,
        })
        setImagePreview(product.image)
      } else {
        // 상품이 없으면 검색 페이지로 리다이렉트
        toast({
          title: "상품 없음",
          description: "요청하신 상품을 찾을 수 없습니다.",
          variant: "destructive",
        })
        router.push("/products/search")
      }

      setIsLoading(false)
    }

    // 로딩 효과를 위한 타임아웃
    const timer = setTimeout(() => {
      loadProduct()
    }, 500)

    return () => clearTimeout(timer)
  }, [params.id, router, toast, getProduct])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setImagePreview(event.target.result as string)
        }
      }
      reader.readAsDataURL(e.target.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // 필수 필드 검증
    if (!formData.name || !formData.price || !formData.category || !formData.brand) {
      toast({
        title: "입력 오류",
        description: "필수 항목을 모두 입력해주세요.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    // 상품 업데이트
    try {
      updateProduct(params.id, {
        name: formData.name,
        price: Number(formData.price),
        category: formData.category,
        brand: formData.brand,
        stock: Number(formData.stock),
        validity: formData.validity,
        description: formData.description,
        image: imagePreview || formData.image,
        nftDetails: formData.nftDetails,
      })

      toast({
        title: "상품 수정 완료",
        description: "상품이 성공적으로 수정되었습니다.",
      })

      // 상세 페이지로 리다이렉트
      router.push(`/products/${params.id}`)
    } catch (error) {
      console.error("상품 수정 오류:", error)
      toast({
        title: "수정 실패",
        description: "상품 수정 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Link href={`/products/${params.id}`}>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <PageHeader title="상품 수정" description="NFT 기프티콘 상품 정보를 수정합니다." />
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">상품명 *</Label>
                    <Input
                      id="name"
                      placeholder="상품명을 입력하세요"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="price">가격 *</Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="가격을 입력하세요"
                      value={formData.price}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">카테고리 *</Label>
                    <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="카테고리 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="커피">커피</SelectItem>
                        <SelectItem value="음식">음식</SelectItem>
                        <SelectItem value="영화">영화</SelectItem>
                        <SelectItem value="쇼핑">쇼핑</SelectItem>
                        <SelectItem value="기타">기타</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="brand">브랜드 *</Label>
                    <Input
                      id="brand"
                      placeholder="브랜드명을 입력하세요"
                      value={formData.brand}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="stock">재고 수량</Label>
                    <Input
                      id="stock"
                      type="number"
                      placeholder="재고 수량을 입력하세요"
                      value={formData.stock}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="validity">유효기간</Label>
                    <Input id="validity" type="date" value={formData.validity} onChange={handleChange} required />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="description">상품 설명</Label>
                  <Textarea
                    id="description"
                    placeholder="상품에 대한 상세 설명을 입력하세요"
                    rows={5}
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="image">상품 이미지</Label>
                  <div className="mt-1 flex items-center space-x-4">
                    <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center text-gray-500 overflow-hidden">
                      {imagePreview && (
                        <img
                          src={imagePreview || "/placeholder.svg"}
                          alt="미리보기"
                          className="w-full h-full object-cover rounded-md"
                        />
                      )}
                    </div>
                    <Input id="image" type="file" accept="image/*" onChange={handleImageChange} />
                  </div>
                </div>

                <div>
                  <Label htmlFor="nft-details">NFT 세부 정보</Label>
                  <Textarea
                    id="nft-details"
                    placeholder="NFT 관련 세부 정보를 입력하세요 (블록체인, 토큰 ID 등)"
                    rows={3}
                    defaultValue={`블록체인: ${formData.nftDetails.blockchain}
토큰 ID: ${formData.nftDetails.tokenId}
컨트랙트: ${formData.nftDetails.contract}
발행일: ${formData.nftDetails.minted}`}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Link href={`/products/${params.id}`}>
                <Button variant="outline" type="button">
                  취소
                </Button>
              </Link>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    수정 중...
                  </>
                ) : (
                  "상품 수정"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

