import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PopularProducts } from "@/components/home/popular-products"

export default function ProductPage({ params }: { params: { id: string } }) {
  // 실제 구현에서는 params.id를 사용하여 상품 데이터를 가져옵니다
  const product = {
    id: params.id,
    title: "스타벅스 아메리카노 Tall",
    price: 4000,
    originalPrice: 4500,
    category: "커피/음료",
    seller: {
      id: "user123",
      name: "닉네임",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 4.8,
      transactions: 56,
    },
    description: "스타벅스 아메리카노 Tall 사이즈 기프티콘입니다. 유효기간은 구매일로부터 30일입니다.",
    image: "/placeholder.svg?height=600&width=600",
    expiryDate: "2023-12-31",
    location: "서울 강남구",
    distance: "1.2km",
    listedAt: "3시간 전",
    views: 24,
    isNew: true,
    isFavorite: false,
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container py-8">
          <Link href="/" className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            돌아가기
          </Link>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              {product.isNew && <Badge className="absolute left-4 top-4 bg-blue-500 hover:bg-blue-600">NEW</Badge>}
            </div>

            <div className="flex flex-col">
              <div className="mb-2 text-sm text-gray-500">{product.category}</div>
              <h1 className="mb-4 text-2xl font-bold md:text-3xl">{product.title}</h1>

              <div className="mb-6">
                <span className="text-3xl font-bold">{product.price.toLocaleString()}원</span>
                {product.originalPrice > product.price && (
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-sm line-through text-gray-500">
                      {product.originalPrice.toLocaleString()}원
                    </span>
                    <span className="text-sm text-primary">
                      {Math.round((1 - product.price / product.originalPrice) * 100)}% 할인
                    </span>
                  </div>
                )}
              </div>

              <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
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
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>
                  {product.location} {product.distance && `· ${product.distance}`}
                </span>
              </div>

              <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
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
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>
                  등록일: {product.listedAt} · 조회 {product.views}회
                </span>
              </div>

              <div className="mb-6 rounded-lg bg-gray-100 p-4">
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 overflow-hidden rounded-full">
                    <Image
                      src={product.seller.avatar || "/placeholder.svg"}
                      alt={product.seller.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-medium">{product.seller.name}</div>
                    <div className="text-xs text-gray-500">
                      거래 {product.seller.transactions}회 · 평점 {product.seller.rating}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-auto grid gap-4">
                <div className="flex gap-2">
                  <Button className="flex-1" size="lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-2 h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    채팅하기
                  </Button>
                  <Button variant="outline" size="icon" className="h-12 w-12">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-5 w-5 ${product.isFavorite ? "fill-primary text-primary" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    <span className="sr-only">찜하기</span>
                  </Button>
                  <Button variant="outline" size="icon" className="h-12 w-12">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                      />
                    </svg>
                    <span className="sr-only">공유하기</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 border-t pt-8">
            <div className="mb-8 flex border-b">
              <button className="border-b-2 border-primary px-4 py-2 font-medium text-primary">상품 설명</button>
              <button className="px-4 py-2 text-gray-500 hover:text-gray-900">판매자 정보</button>
              <button className="px-4 py-2 text-gray-500 hover:text-gray-900">거래 후기</button>
            </div>

            <div className="prose max-w-none">
              <p>{product.description}</p>
              <ul>
                <li>유효기간: {product.expiryDate}</li>
                <li>사용 가능 매장: 전국 스타벅스 매장</li>
                <li>교환 및 환불: 구매 후 7일 이내 가능</li>
              </ul>
            </div>
          </div>

          <div className="mt-16">
            <h2 className="mb-8 text-2xl font-bold">비슷한 상품</h2>
            <PopularProducts />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

