"use client";

import { useState } from "react";
import Image from "next/image";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductCard } from "@/components/product/product-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Copy,
  CreditCard,
  Heart,
  Package,
  Settings,
  ShoppingBag,
  User,
} from "lucide-react";

export default function MyPage() {
  // Sample user data
  const user = {
    name: "닉네임",
    avatar: "/placeholder.svg?height=100&width=100",
    wallet: "0x1234...5678",
    joinDate: "2025-01-15",
    balance: 125000,
  };

  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(user.wallet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Sample product data
  const myProducts = [
    {
      id: "1",
      title: "스타벅스 아메리카노 Tall",
      price: 4500,
      category: "커피/음료",
      image: "/placeholder.svg?height=400&width=400",
      location: "서울 강남구",
      listedAt: "3일 전",
      isFavorite: false,
    },
    {
      id: "2",
      title: "CGV 영화 관람권",
      price: 11000,
      category: "문화/생활",
      image: "/placeholder.svg?height=400&width=400",
      location: "서울 송파구",
      listedAt: "1주일 전",
      isFavorite: true,
    },
    {
      id: "3",
      title: "배스킨라빈스 파인트",
      price: 8900,
      category: "뷰티/아이스크림",
      image: "/placeholder.svg?height=400&width=400",
      location: "서울 마포구",
      listedAt: "2주일 전",
      isFavorite: false,
    },
    {
      id: "4",
      title: "교보문고 5만원권",
      price: 48000,
      category: "문화/생활",
      image: "/placeholder.svg?height=400&width=400",
      location: "서울 종로구",
      listedAt: "3주일 전",
      isFavorite: true,
    },
  ];

  const sidebarItems = [
    { icon: User, label: "계정 정보", value: "account" },
    { icon: ShoppingBag, label: "구매 내역", value: "purchases" },
    { icon: Package, label: "판매 내역", value: "sales" },
    { icon: Heart, label: "찜한 상품", value: "favorites" },
    { icon: Settings, label: "설정", value: "settings" },
  ];

  const [activeTab, setActiveTab] = useState("account");

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-gray-50 py-12">
        <div className="container">
          <h1 className="mb-8 text-3xl font-bold">마이페이지</h1>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[300px_1fr]">
            {/* Sidebar */}
            <aside className="space-y-6">
              <Card className="overflow-hidden border-none shadow-md">
                <CardHeader className="bg-gradient-to-r from-primary-700 to-primary-500 text-white">
                  <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-white">
                    <Image
                      src={user.avatar || "/placeholder.svg"}
                      alt={user.name}
                      width={96}
                      height={96}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <CardTitle className="text-center text-white">
                    {user.name}
                  </CardTitle>
                  <div className="flex items-center justify-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs backdrop-blur-sm">
                    <span className="truncate">{user.wallet}</span>
                    <button
                      onClick={copyToClipboard}
                      className="ml-1 rounded-full p-1 hover:bg-white/20"
                    >
                      <Copy className="h-3 w-3" />
                      <span className="sr-only">복사</span>
                    </button>
                  </div>
                  {copied && (
                    <div className="absolute right-4 top-4 rounded-md bg-white px-2 py-1 text-xs text-primary-700 shadow-md">
                      복사됨!
                    </div>
                  )}
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <span className="text-muted-foreground">가입일</span>
                      <span className="font-medium">{user.joinDate}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <span className="text-muted-foreground">보유 금액</span>
                      <span className="font-medium">
                        {user.balance.toLocaleString()}원
                      </span>
                    </div>
                    <Button className="w-full">
                      <CreditCard className="mr-2 h-4 w-4" /> 충전하기
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md">
                <CardContent className="p-0">
                  <nav className="flex flex-col">
                    {sidebarItems.map((item) => (
                      <button
                        key={item.value}
                        className={`flex items-center gap-3 border-l-4 px-6 py-4 text-left transition-colors ${
                          activeTab === item.value
                            ? "border-primary bg-primary-50 text-primary"
                            : "border-transparent hover:bg-gray-100"
                        }`}
                        onClick={() => setActiveTab(item.value)}
                      >
                        <item.icon
                          className={`h-5 w-5 ${
                            activeTab === item.value ? "text-primary" : ""
                          }`}
                        />
                        <span className="font-medium">{item.label}</span>
                      </button>
                    ))}
                  </nav>
                </CardContent>
              </Card>
            </aside>

            {/* Main Content */}
            <div>
              <Card className="border-none shadow-md">
                <CardContent className="p-6">
                  <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full"
                  >
                    <TabsList className="mb-8 grid w-full grid-cols-5">
                      {sidebarItems.map((item) => (
                        <TabsTrigger key={item.value} value={item.value}>
                          <item.icon className="mr-2 h-4 w-4" />
                          <span className="hidden sm:inline">{item.label}</span>
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    <TabsContent value="account" className="mt-6 space-y-6">
                      <div>
                        <h2 className="mb-4 text-xl font-semibold">
                          계정 정보
                        </h2>
                        <p className="mb-6 text-sm text-muted-foreground">
                          개인 정보를 확인하고 수정할 수 있습니다.
                        </p>
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">닉네임</Label>
                          <Input id="name" defaultValue={user.name} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="wallet">지갑 주소</Label>
                          <div className="flex gap-2">
                            <Input
                              id="wallet"
                              value={user.wallet}
                              readOnly
                              className="bg-muted"
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={copyToClipboard}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <Button>정보 수정</Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="purchases" className="mt-6">
                      <div>
                        <h2 className="mb-4 text-xl font-semibold">
                          구매 내역
                        </h2>
                        <p className="mb-6 text-sm text-muted-foreground">
                          구매한 기프티콘을 확인하고 사용할 수 있습니다.
                        </p>
                      </div>
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {myProducts.slice(0, 3).map((product) => (
                          <ProductCard key={product.id} {...product} />
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="sales" className="mt-6">
                      <div>
                        <h2 className="mb-4 text-xl font-semibold">
                          판매 내역
                        </h2>
                        <p className="mb-6 text-sm text-muted-foreground">
                          판매 중인 기프티콘과 판매 완료된 기프티콘을 확인할 수
                          있습니다.
                        </p>
                      </div>
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {myProducts.slice(1, 4).map((product) => (
                          <ProductCard key={product.id} {...product} />
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="favorites" className="mt-6">
                      <div>
                        <h2 className="mb-4 text-xl font-semibold">
                          찜한 상품
                        </h2>
                        <p className="mb-6 text-sm text-muted-foreground">
                          관심 있는 기프티콘을 모아볼 수 있습니다.
                        </p>
                      </div>
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {myProducts
                          .filter((product) => product.isFavorite)
                          .map((product) => (
                            <ProductCard key={product.id} {...product} />
                          ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="settings" className="mt-6">
                      <div>
                        <h2 className="mb-4 text-xl font-semibold">설정</h2>
                        <p className="mb-6 text-sm text-muted-foreground">
                          계정 설정 및 알림 설정을 관리할 수 있습니다.
                        </p>
                      </div>
                      <div className="space-y-6">
                        <Card>
                          <CardHeader>
                            <CardTitle>알림 설정</CardTitle>
                            <CardDescription>
                              알림 수신 여부를 설정합니다.
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label htmlFor="marketing">마케팅 알림</Label>
                              <input
                                type="checkbox"
                                id="marketing"
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label htmlFor="transaction">거래 알림</Label>
                              <input
                                type="checkbox"
                                id="transaction"
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                defaultChecked
                              />
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle>보안 설정</CardTitle>
                            <CardDescription>
                              계정 보안 설정을 관리합니다.
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <Button variant="outline" className="w-full">
                              비밀번호 변경
                            </Button>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
