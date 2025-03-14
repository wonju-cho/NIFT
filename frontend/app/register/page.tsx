"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function RegisterPage() {
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImagePreview(null)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 py-12">
        <div className="container max-w-4xl">
          <h1 className="mb-8 text-center text-3xl font-bold">상품 등록하기</h1>

          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <div className="rounded-lg border bg-white p-6">
                <div className="mb-6">
                  <label htmlFor="image-upload" className="mb-2 block text-sm font-medium">
                    상품 이미지
                  </label>
                  {imagePreview ? (
                    <div className="relative aspect-square overflow-hidden rounded-lg border">
                      <Image
                        src={imagePreview || "/placeholder.svg"}
                        alt="상품 이미지 미리보기"
                        fill
                        className="object-cover"
                      />
                      <Button
                        type="button"
                        className="absolute right-2 top-2 h-8 w-8 rounded-full bg-red-500 p-0 text-white hover:bg-red-600"
                        onClick={removeImage}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span className="sr-only">이미지 삭제</span>
                      </Button>
                    </div>
                  ) : (
                    <label
                      htmlFor="image-upload"
                      className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed bg-gray-50 text-gray-500 hover:bg-gray-100"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      <span className="text-sm font-medium">이미지 업로드</span>
                      <span className="text-xs">JPG, PNG, GIF (최대 5MB)</span>
                    </label>
                  )}
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handleImageUpload}
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="expiry-date" className="mb-2 block text-sm font-medium">
                      유효기간
                    </label>
                    <Input id="expiry-date" type="date" placeholder="유효기간을 선택하세요" />
                  </div>

                  <div>
                    <label htmlFor="barcode" className="mb-2 block text-sm font-medium">
                      바코드 번호
                    </label>
                    <Input id="barcode" type="text" placeholder="바코드 번호를 입력하세요" />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-lg border bg-white p-6">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="title" className="mb-2 block text-sm font-medium">
                      상품명
                    </label>
                    <Input id="title" type="text" placeholder="상품명을 입력하세요" />
                  </div>

                  <div>
                    <label htmlFor="category" className="mb-2 block text-sm font-medium">
                      카테고리
                    </label>
                    <select
                      id="category"
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">카테고리 선택</option>
                      <option value="coffee">커피/음료</option>
                      <option value="vouchers">상품권</option>
                      <option value="delivery">배달/배송</option>
                      <option value="convenience">편의점/마트</option>
                      <option value="food">치킨/피자/버거</option>
                      <option value="beauty">뷰티/아이스크림</option>
                      <option value="gas">주유</option>
                      <option value="culture">문화/생활</option>
                      <option value="dining">외식</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="price" className="mb-2 block text-sm font-medium">
                      판매가격
                    </label>
                    <Input id="price" type="number" placeholder="판매가격을 입력하세요" />
                  </div>

                  <div>
                    <label htmlFor="description" className="mb-2 block text-sm font-medium">
                      상품 설명
                    </label>
                    <textarea
                      id="description"
                      placeholder="상품에 대한 상세 설명을 입력하세요"
                      rows={5}
                      className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
                    ></textarea>
                  </div>
                </div>
              </div>

              <Button className="w-full" size="lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-2 h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                상품 등록하기
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

