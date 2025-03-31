"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import PageHeader from "@/components/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useProductStore } from "@/lib/store"

export default function ProductRegister() {
  const router = useRouter()
  const { toast } = useToast()
  const { addProduct } = useProductStore()
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
    nftDetails: {
      blockchain: "Ethereum",
      tokenId: "",
      contract: "",
      minted: new Date().toISOString().split("T")[0],
    },
  })

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

    // 상품 추가
    try {
      // 새 상품 생성
      addProduct({
        name: formData.name,
        price: Number(formData.price),
        category: formData.category,
        brand: formData.brand,
        stock: Number(formData.stock),
        validity: formData.validity,
        description: formData.description,
        image: imagePreview || "/placeholder.svg?height=200&width=200",
        nftDetails: formData.nftDetails,
      })

      toast({
        title: "상품 등록 완료",
        description: "상품이 성공적으로 등록되었습니다.",
      })

      // 홈으로 리다이렉트
      router.push("/")
    } catch (error) {
      console.error("상품 등록 오류:", error)
      toast({
        title: "등록 실패",
        description: "상품 등록 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <PageHeader title="상품 등록" description="새로운 NFT 기프티콘 상품을 등록합니다." />

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
                    <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center text-gray-500">
                      {imagePreview ? (
                        <img
                          src={imagePreview || "/placeholder.svg"}
                          alt="미리보기"
                          className="w-full h-full object-cover rounded-md"
                        />
                      ) : (
                        <Upload className="w-8 h-8" />
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
                    defaultValue={`블록체인: ${formData.nftDetails.blockchain}`}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button variant="outline" type="button" onClick={() => router.push("/")}>
                취소
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    등록 중...
                  </>
                ) : (
                  "상품 등록"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

