"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const navigation = [
  { name: "홈", href: "/" },
  { name: "중고거래", href: "/trade" },
  { name: "마이페이지", href: "/mypage" },
  { name: "상품등록", href: "/register" },
]

const categories = [
  { name: "전체상품보기", href: "/products" },
  { name: "내 주변", href: "/products/nearby", highlight: true },
  { name: "커피/음료", href: "/products/coffee" },
  { name: "상품권", href: "/products/vouchers" },
  { name: "배달/배송", href: "/products/delivery" },
  { name: "편의점/마트", href: "/products/convenience" },
  { name: "치킨/피자/버거", href: "/products/food" },
  { name: "뷰티/아이스크림", href: "/products/beauty" },
  { name: "주유", href: "/products/gas" },
  { name: "문화/생활", href: "/products/culture" },
  { name: "외식", href: "/products/dining" },
  { name: "이벤트", href: "/products/events", highlight: true },
]

export function Header() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-10 w-10 overflow-hidden">
              <Image
                src="/1.png?height=40&width=40"
                alt="NIFT Logo"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            <span className="text-2xl font-bold tracking-tight text-primary">NIFT</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === item.href ? "text-primary" : "text-gray-900",
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <div className="relative w-64">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500"
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
            <Input type="search" placeholder="상품 검색..." className="w-full rounded-full pl-8 md:w-64 lg:w-80" />
          </div>

          <Button variant="ghost" size="icon" aria-label="찜 목록">
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
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </Button>

          <Button variant="ghost" size="icon" aria-label="채팅">
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
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </Button>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/signin">로그인</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/signup">회원가입</Link>
            </Button>
          </div>
        </div>

        {/* 모바일 메뉴 버튼 */}
        <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* 모바일 메뉴 */}
      {isMenuOpen && (
        <div className="md:hidden border-t">
          <div className="p-4 space-y-4">
            <div className="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500"
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
              <Input type="search" placeholder="상품 검색..." className="w-full rounded-full pl-8" />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/signin">로그인</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/signup">회원가입</Link>
              </Button>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">메뉴</div>
              <nav className="grid gap-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                      pathname === item.href ? "bg-primary/10 text-primary" : "hover:bg-gray-100",
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">카테고리</div>
              <nav className="grid gap-1">
                {categories.map((category) => (
                  <Link
                    key={category.name}
                    href={category.href}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                      pathname === category.href ? "bg-primary/10 text-primary" : "hover:bg-gray-100",
                      category.highlight && "text-primary font-medium",
                    )}
                  >
                    {category.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}

      <div className="hidden md:block border-t">
        <div className="container overflow-x-auto">
          <div className="flex h-12 items-center gap-6 whitespace-nowrap">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className={cn(
                  "flex items-center gap-2 text-sm transition-colors hover:text-primary",
                  pathname === category.href ? "text-primary font-medium" : "text-gray-900",
                  category.highlight && "text-primary font-medium",
                )}
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}

