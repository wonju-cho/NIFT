"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import Image from "next/image";
import { getSSFBalance } from "@/lib/api/web3";
import { useLoading } from "@/components/LoadingContext";
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
import {
  ArticleCard,
  ArticleCardProps,
} from "@/components/article/article-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertCircle,
  Copy,
  CreditCard,
  Heart,
  LogOut,
  Package,
  Settings,
  ShoppingBag,
  User,
  Gift,
  Clock
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  deleteUser,
  updateUserNickname,
  updateWallet,
  fetchLikedArticles,
} from "@/lib/api/mypage";
import { useRouter } from "next/navigation";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { GiftCard } from "@/components/gift/gift-card"


const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const getAccessToken = () => {
  if (typeof window !== "undefined") {
    console.log("토큰!!! : ", localStorage.getItem("access_token"));
    return localStorage.getItem("access_token") || null;
  }
  return null;
};
const getKakaoToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("kakao_access_token") || null;
  }
  return null;
};

export default function MyPage() {
  const { isLoading, setIsLoading } = useLoading(); // 로딩 상태 가져오기
  const [user, setUser] = useState({
    profileImage: "/placeholder.svg",
    nickname: "",
    walletAddress: "",
    balance: 0,
  });
  const [copied, setCopied] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [nickname, setNickname] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [ssfBalance, setSsfBalance] = useState<string>("0");
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [likedArticles, setLikedArticles] = useState<ArticleCardProps[]>([]);
  const [totalPage, setTotalPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);

  // 임시 작성 코드
  const [giftCardTab, setGiftCardTab] = useState("available")

  const PAGE_GROUP_SIZE = 5; // 한 번에 표시할 페이지 수
  // 지금 페이지 그룹 계산
  const currentGroup = Math.ceil((currentPage + 1) / PAGE_GROUP_SIZE);
  const startPage = (currentGroup - 1) * PAGE_GROUP_SIZE;
  const endPage = Math.min(startPage + PAGE_GROUP_SIZE, totalPage);

  // 유저 정보 가져오기
  useEffect(() => {
    const fetchUserData = async () => {
      const accessToken = getAccessToken(); // 토큰 가져오기
      if (!accessToken) {
        console.error("Access Token이 없습니다. 로그인 필요.");
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/users/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`, // ✅ 토큰 추가
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`API 요청 실패: ${response.status}`);
        }

        const data = await response.json();

        setUser({
          profileImage: data.profileImage
            ? data.profileImage
            : "/placeholder.svg",
          nickname: data.nickname,
          walletAddress: data.walletAddress,
          balance: data.balance || 0,
        });

        setNickname(data.nickname);
        setWalletAddress(data.walletAddress || null);
        setAccessToken(getAccessToken());
      } catch (error) {
        console.error("유저 정보 불러오기 실패:", error);
      }
    };

    fetchUserData();
  }, []);

  // walletAddress가 변경될 때 SSF 잔액 가져오기
  useEffect(() => {
    const fetchSSFBalance = async () => {
      if (!walletAddress) return; // 지갑 주소 없으면 실행 안 함

      try {
        const balance = await getSSFBalance(walletAddress);
        console.log("SSF Balance:", balance); // 디버깅용
        setSsfBalance(balance);
      } catch (error) {
        console.error("SSF 잔액 가져오기 실패:", error);
      }
    };

    fetchSSFBalance();
  }, [walletAddress]);

  const shortenAddress = (address: string | null) => {
    if (!address) return "연결되지 않음";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const connectOrUpdateWallet = async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      setIsLoading(true);
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);

        // 기존 연결된 지갑 삭제해서 다시 요청하게
        await provider.send("wallet_requestPermissions", [
          { eth_accounts: {} },
        ]);
        const accounts = await provider.send("eth_requestAccounts", []); // 메타마스크 팝업 띄우기
        const newWalletAddress = ethers.getAddress(accounts[0]);
        setWalletAddress(newWalletAddress);
      } catch (error) {
        console.error("Metamask 연결 실패:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      alert("Metamask가 설치되지 않았습니다.");
    }
  };

  const deleteProcess = async () => {
    setIsLoading(true);
    try {
      console.log("회원 탈퇴 요청 시작");
      const kakaoAccessToken = getKakaoToken(); // 회원탈퇴시 카카오 토큰이 필요함
      const accessToken = getAccessToken();

      if (!kakaoAccessToken || !accessToken) {
        console.error("필요한 토큰이 없습니다.");
        return;
      }

      const response = await fetch(`${BASE_URL}/users/me`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${accessToken}`, // JWT로 서버에서 사용자 인증
          "Kakao-Authorization": `Bearer ${kakaoAccessToken}`, // kakao_access_token을 Authorization 헤더에 포함
          "Content-Type": "application/json",
        },
      });

      console.log("회원 탈퇴 응답:", response);

      if (response.status === 204) {
        setShowDeleteConfirm(false);
        localStorage.clear(); // 저장된 모든 토큰 삭제
        console.log("탈퇴 완료");
        router.push("/");
      }
    } catch (error) {
      console.error("회원 탈퇴 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateNickname = async () => {
    setIsLoading(true); // 로딩 시작
    try {
      const data = await updateUserNickname(nickname);
      if (data.status === 204) {
        alert("닉네임이 수정되었습니다.");
        window.location.reload();
      } else {
        console.error("닉네임 업데이트 실패");
      }
    } catch (error) {
      console.error("닉네임 업데이트 중 오류 발생:", error);
    } finally {
      setIsLoading(false); // 로딩 종료
    }
  };

  const updateWalletAddress = async () => {
    if (!walletAddress) return;
    setIsLoading(true); // 로딩 시작
    try {
      const data = await updateWallet(walletAddress);
      if (data.status === 204) {
        alert("지갑 주소가 수정되었습니다.");
        window.location.reload();
      } else {
        console.error("지갑 주소 업데이트 실패");
      }
    } catch (error) {
      console.error("지갑 주소 업데이트 중 오류 발생:", error);
    } finally {
      setIsLoading(false); // 로딩 종료
    }
  };

  const router = useRouter();

  const copyToClipboard = () => {
    if (user.walletAddress) {
      navigator.clipboard.writeText(user.walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // 찜한 상품 목록 불러오기
  useEffect(() => {
    const loadLikeArticles = async () => {
      setIsLoading(true);
      try {
        const data = await fetchLikedArticles(currentPage);

        const transformedArticles = data.likes.map((article) => ({
          articleId: article.articleId,
          title: article.title,
          brandName: "", // 브랜드 정보가 없을 경우 빈 문자열
          currentPrice: article.currentPrice,
          originalPrice: article.currentPrice, // 원래 가격이 없으면 현재 가격으로 설정
          discountRate: 0, // 할인율 기본값 설정
          imageUrl: article.imageUrl,
          isLiked: true, // 찜한 상품이므로 true
        }));

        setLikedArticles(transformedArticles);
        setTotalPage(data?.totalPage || 1);
      } catch (error) {
        console.error("찜한 상품 목록 가져오는데 에러 생김!! : ", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadLikeArticles();
  }, [currentPage]);

  // Sample product data
  const availableGiftCards = [
    {
      id: "1",
      title: "디지털 상품권 5천원권",
      brand: "공차",
      price: 5000,
      sender: "미서",
      date: "2021.06.22",
      expiryDays: "D-38",
      imageUrl: "/placeholder.svg?height=200&width=200&text=공차",
    },
    {
      id: "2",
      title: "싱글레귤러 아이스크림",
      brand: "베스킨라빈스",
      price: 3800,
      sender: "미서",
      date: "2023.01.22",
      expiryDays: "D-73",
      imageUrl: "/placeholder.svg?height=200&width=200&text=베스킨라빈스",
    },
    {
      id: "3",
      title: "생딸기 설빙",
      brand: "설빙",
      price: 8500,
      sender: "미서",
      date: "2024.03.04",
      expiryDays: "D-73",
      imageUrl: "/placeholder.svg?height=200&width=200&text=설빙",
    },
    {
      id: "4",
      title: "황올반+BBQ양념반+콜라1.25L",
      brand: "BBQ",
      price: 21000,
      sender: "미서",
      date: "2024.03.04",
      expiryDays: "D-79",
      imageUrl: "/placeholder.svg?height=200&width=200&text=BBQ",
    },
  ];

  const usedGiftCards = [
    {
      id: "5",
      title: "아메리카노 Tall",
      brand: "스타벅스",
      price: 4500,
      sender: "김민지",
      date: "2023.12.15",
      usedDate: "2024.01.10",
      imageUrl: "/placeholder.svg?height=200&width=200&text=스타벅스",
    },
    {
      id: "6",
      title: "빅맥 세트",
      brand: "맥도날드",
      price: 8900,
      sender: "박준호",
      date: "2023.11.20",
      usedDate: "2023.12.05",
      imageUrl: "/placeholder.svg?height=200&width=200&text=맥도날드",
    },
  ];

  const likedProduct = [
    {
      productId: "1",
      title: "스타벅스 아메리카노 Tall",
      currentPrice: 4500,
      originalPrice: 5000,
      discountRate: 10,
      imageUrl: "/placeholder.svg?height=400&width=400&text=스타벅스",
      isLiked: true,
    },
    {
      productId: "2",
      title: "CGV 영화 관람권",
      currentPrice: 11000,
      originalPrice: 13000,
      discountRate: 15,
      imageUrl: "/placeholder.svg?height=400&width=400&text=CGV",
      isLiked: true,
    },
    {
      productId: "3",
      title: "배스킨라빈스 파인트",
      currentPrice: 8900,
      originalPrice: 9800,
      discountRate: 9,
      imageUrl: "/placeholder.svg?height=400&width=400&text=배스킨라빈스",
      isLiked: true,
    },
  ];

  const transactionHistory = {
    purchases: [
      {
        id: "p1",
        title: "스타벅스 아메리카노 Tall",
        price: 4500,
        date: "2024.02.15",
        seller: "김판매",
        status: "완료",
        imageUrl: "/placeholder.svg?height=100&width=100&text=스타벅스",
      },
      {
        id: "p2",
        title: "CGV 영화 관람권",
        price: 11000,
        date: "2024.01.20",
        seller: "이영화",
        status: "완료",
        imageUrl: "/placeholder.svg?height=100&width=100&text=CGV",
      },
    ],
    sales: [
      {
        id: "s1",
        title: "배스킨라빈스 파인트",
        price: 8900,
        date: "2024.02.10",
        buyer: "박아이스",
        status: "완료",
        imageUrl: "/placeholder.svg?height=100&width=100&text=배스킨라빈스",
      },
    ],
    gifts: [
      {
        id: "g1",
        title: "BBQ 황금올리브 치킨",
        price: 18000,
        date: "2024.03.01",
        recipient: "최친구",
        status: "전송완료",
        imageUrl: "/placeholder.svg?height=100&width=100&text=BBQ",
      },
    ],
  }


  const sidebarItems = [
    { icon: Gift, label: "보유 NIFT", value: "gifticons" },
    { icon: Clock, label: "거래내역", value: "transactions" },
    { icon: Package, label: "선물 추억", value: "memories" },
    { icon: Heart, label: "찜한 상품", value: "favorites" },
    { icon: Settings, label: "설정", value: "settings" },
  ];

  const [activeTab, setActiveTab] = useState("gifticons");

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-white py-12">
        <div className="container">
          {!accessToken ? (
            <div className="flex flex-col items-center justify-center h-[60vh]">
              <div className="relative w-32 h-32 border-2 border-black rounded-full flex items-center justify-center">
                <Image
                  src="/1.svg"
                  alt="로그인 필요"
                  width={120}
                  height={120}
                  className="rounded-full object-cover"
                  unoptimized
                />
              </div>
              <p className="mt-4 text-lg font-semibold">
                로그인을 진행해주세요!
              </p>
            </div>
          ) : (
            <>
              <h1 className="mb-8 text-3xl font-bold">마이페이지</h1>

              <div className="grid grid-cols-1 gap-8 lg:grid-cols-[300px_1fr]">
                {/* Sidebar */}
                <aside className="space-y-6">
                  <Card className="overflow-hidden border-none shadow-md">
                    <CardHeader className="bg-gradient-to-r from-primary-700 to-primary-500 text-white">
                      <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-white">
                        <Image
                          src={user.profileImage}
                          alt={user.nickname}
                          width={96}
                          height={96}
                          className="h-full w-full object-cover"
                          unoptimized
                        />
                      </div>
                      <CardTitle className="text-center text-white">
                        {user.nickname}
                      </CardTitle>
                      <div className="flex items-center justify-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs backdrop-blur-sm">
                        <span className="truncate">
                          {shortenAddress(walletAddress)}
                        </span>
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
                        {/* <div className="grid grid-cols-2 gap-2 text-sm">
                        <span className="text-muted-foreground">가입일</span>
                        <span className="font-medium">{user.joinDate}</span>
                      </div> */}
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <span className="text-muted-foreground">
                            보유 금액
                          </span>
                          <span className="font-medium">{ssfBalance} SSF</span>
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
                              <span className="hidden sm:inline">
                                {item.label}
                              </span>
                            </TabsTrigger>
                          ))}
                        </TabsList>
                        
                        {/* 선물함 탭 */}
                        <TabsContent value="gifticons" className="mt-6 space-y-6">
                          <div>
                            <h2 className="mb-4 text-xl font-semibold">
                              NIFT함
                            </h2>
                            <p className="mb-6 text-sm text-muted-foreground">
                              사용가능한 선물이 {availableGiftCards.length} 개 남아있어요.
                            </p>
                          </div>

                          <Tabs defaultValue="available" onValueChange={setGiftCardTab}>
                            <TabsList className="w-full">
                              <TabsTrigger value="available" className="flex-1">
                                사용가능 {availableGiftCards.length}
                              </TabsTrigger>
                              <TabsTrigger value="used" className="flex-1">
                                사용완료 {usedGiftCards.length}
                              </TabsTrigger>
                            </TabsList>

                            <TabsContent value="available" className="mt-6">
                              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                {availableGiftCards.map((card) => (
                                  <GiftCard key={card.id} {...card} />
                                ))}
                              </div>
                            </TabsContent>

                            <TabsContent value="used" className="mt-6">
                              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                {usedGiftCards.map((card) => (
                                  <GiftCard key={card.id} {...card} />
                                ))}
                              </div>
                            </TabsContent>
                          </Tabs>
                        </TabsContent>
                        {/* 거래내역 탭 */}
                        <TabsContent value="transactions" className="mt-6">
                          <div>
                            <h2 className="mb-4 text-xl font-semibold">
                              거래내역
                            </h2>
                            <p className="mb-6 text-sm text-muted-foreground">
                              구매, 판매, 선물 내역을 확인 할 수 있습니다.
                            </p>
                          </div>
                          <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="purchases">
                              <AccordionTrigger className="text-lg font-medium">
                                구매내역 ({transactionHistory.purchases.length})
                              </AccordionTrigger>
                              <AccordionContent>
                                {transactionHistory.purchases.length > 0 ? (
                                  <div className="space-y-4">
                                    {transactionHistory.purchases.map((item) => (
                                      <div key={item.id} className="flex items-center gap-4 rounded-lg border bg-white p-4">
                                        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                                          <Image
                                            src={item.imageUrl || "/placeholder.svg"}
                                            alt={item.title}
                                            fill
                                            className="object-cover"
                                          />
                                        </div>
                                        <div className="flex-1">
                                          <h3 className="font-medium">{item.title}</h3>
                                          <div className="mt-1 text-sm text-gray-500">
                                            <div>판매자: {item.seller}</div>
                                            <div>구매일: {item.date}</div>
                                          </div>
                                        </div>
                                        <div className="text-right">
                                          <div className="font-bold">{item.price.toLocaleString()}원</div>
                                          <div className="mt-1 text-sm text-primary">{item.status}</div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="py-4 text-center text-gray-500">구매 내역이 없습니다.</div>
                                )}
                              </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="sales">
                              <AccordionTrigger className="text-lg font-medium">
                                판매내역 ({transactionHistory.sales.length})
                              </AccordionTrigger>
                              <AccordionContent>
                                {transactionHistory.sales.length > 0 ? (
                                  <div className="space-y-4">
                                    {transactionHistory.sales.map((item) => (
                                      <div key={item.id} className="flex items-center gap-4 rounded-lg border bg-white p-4">
                                        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                                          <Image
                                            src={item.imageUrl || "/placeholder.svg"}
                                            alt={item.title}
                                            fill
                                            className="object-cover"
                                          />
                                        </div>
                                        <div className="flex-1">
                                          <h3 className="font-medium">{item.title}</h3>
                                          <div className="mt-1 text-sm text-gray-500">
                                            <div>구매자: {item.buyer}</div>
                                            <div>판매일: {item.date}</div>
                                          </div>
                                        </div>
                                        <div className="text-right">
                                          <div className="font-bold">{item.price.toLocaleString()}원</div>
                                          <div className="mt-1 text-sm text-primary">{item.status}</div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="py-4 text-center text-gray-500">판매 내역이 없습니다.</div>
                                )}
                              </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="gifts">
                              <AccordionTrigger className="text-lg font-medium">
                                보낸 선물 ({transactionHistory.gifts.length})
                              </AccordionTrigger>
                              <AccordionContent>
                                {transactionHistory.gifts.length > 0 ? (
                                  <div className="space-y-4">
                                    {transactionHistory.gifts.map((item) => (
                                      <div key={item.id} className="flex items-center gap-4 rounded-lg border bg-white p-4">
                                        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                                          <Image
                                            src={item.imageUrl || "/placeholder.svg"}
                                            alt={item.title}
                                            fill
                                            className="object-cover"
                                          />
                                        </div>
                                        <div className="flex-1">
                                          <h3 className="font-medium">{item.title}</h3>
                                          <div className="mt-1 text-sm text-gray-500">
                                            <div>받는 사람: {item.recipient}</div>
                                            <div>선물일: {item.date}</div>
                                          </div>
                                        </div>
                                        <div className="text-right">
                                          <div className="font-bold">{item.price.toLocaleString()}원</div>
                                          <div className="mt-1 text-sm text-primary">{item.status}</div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="py-4 text-center text-gray-500">보낸 선물이 없습니다.</div>
                                )}
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </TabsContent>
                        {/* 선물받은 카드 보관함 탭 */}
                        <TabsContent value="memories" className="mt-6">
                          <div>
                            <h2 className="mb-4 text-xl font-semibold">
                              NIFT카드
                            </h2>
                            <p className="mb-6 text-sm text-muted-foreground">
                              소중한 사람들과 주고받은 선물 추억을 확인해보세요.
                            </p>
                          </div>
                          <div className="text-center py-12 text-gray-500">아직 선물 추억이 없습니다.</div>
                          {/* <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                          {myArticles.slice(1, 4).map((article) => (
                            <ArticleCard key={article.id} {...article} />
                          ))}
                        </div> */}
                        </TabsContent>
                        
                        {/* 찜한 상품 탭 */}
                        <TabsContent value="favorites" className="mt-6">
                          <div>
                            <h2 className="mb-4 text-xl font-semibold">
                              찜한 상품
                            </h2>
                            <p className="mb-6 text-sm text-muted-foreground">
                              관심 있는 기프티콘을 모아볼 수 있습니다.
                            </p>
                          </div>

                          {/* 찜한 상품 목록 표시 */}
                          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {likedArticles?.length > 0 ? (
                              likedArticles.map((article) => (
                                <ArticleCard
                                  key={article.articleId}
                                  {...article}
                                />
                              ))
                            ) : (
                              <p className="text-center text-gray-500">
                                찜한 상품이 없습니다.
                              </p>
                            )}
                          </div>

                          {/* 페이지네이션 */}
                          <div className="mt-8 flex justify-center items-center gap-2">
                            <Button
                              variant="ghost"
                              disabled={currentPage === 0}
                              onClick={() =>
                                setCurrentPage((prev) => Math.max(prev - 1, 0))
                              }
                            >
                              ‹ 이전
                            </Button>

                            {Array.from(
                              { length: endPage - startPage },
                              (_, i) => startPage + i
                            ).map((pageNum) => (
                              <Button
                                key={pageNum}
                                variant={
                                  currentPage === pageNum ? "default" : "ghost"
                                }
                                onClick={() => setCurrentPage(pageNum)}
                              >
                                {pageNum + 1} {/* 1부터 표시 */}
                              </Button>
                            ))}

                            <Button
                              variant="ghost"
                              disabled={currentPage === totalPage - 1}
                              onClick={() =>
                                setCurrentPage((prev) =>
                                  Math.min(prev + 1, totalPage - 1)
                                )
                              }
                            >
                              다음 ›
                            </Button>
                          </div>
                        </TabsContent>
                        {/* 설정 탭 */}
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
                                <CardTitle>계정 정보</CardTitle>
                                <CardDescription>개인 정보를 확인하고 수정할 수 있습니다.</CardDescription>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <div className="space-y-2">
                                  <Label htmlFor="name">닉네임</Label>
                                  <div className="flex gap-2">
                                    <Input 
                                        id="name" 
                                        value={nickname} 
                                        onChange={(e) => setNickname(e.target.value)} 
                                      />
                                    <Button 
                                        className="whitespace-nowrap"
                                        onClick={updateNickname}>
                                      수정
                                    </Button>
                                  </div>
                                </div>
                                <hr />
                                <div className="space-y-2">
                                  <Label htmlFor="wallet">지갑 주소</Label>
                                  <div className="flex gap-2">
                                    <Input
                                      id="wallet"
                                      value={
                                        walletAddress
                                            ? walletAddress
                                            : "연결되지 않음"
                                        }
                                      readOnly
                                      className="bg-muted"
                                    />
                                    <Button
                                        variant="outline"
                                        className="whitespace-nowrap" 
                                        onClick={connectOrUpdateWallet}>
                                      {walletAddress ? "변경하기" : "연결하기"}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={copyToClipboard}>
                                      <Copy className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      className="whitespace-nowrap"
                                      onClick={updateWalletAddress}
                                    >
                                      수정
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>

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

                            <Card>
                              <CardHeader>
                                <CardTitle>계정 관리</CardTitle>
                                <CardDescription>
                                  계정 관련 중요 설정을 관리합니다.
                                </CardDescription>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <Alert
                                  variant="destructive"
                                  className="border-red-300 bg-red-50"
                                >
                                  <AlertCircle className="h-4 w-4" />
                                  <AlertTitle>주의</AlertTitle>
                                  <AlertDescription>
                                    회원 탈퇴 시 모든 계정 정보와 거래 내역이
                                    삭제되며, 복구할 수 없습니다.
                                  </AlertDescription>
                                </Alert>

                                <Dialog
                                  open={showDeleteConfirm}
                                  onOpenChange={setShowDeleteConfirm}
                                >
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      className="w-full border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
                                    >
                                      <LogOut className="mr-2 h-4 w-4" />
                                      회원 탈퇴
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>
                                        정말 탈퇴하시겠습니까?
                                      </DialogTitle>
                                      <DialogDescription>
                                        회원 탈퇴 시 모든 계정 정보와 거래
                                        내역이 영구적으로 삭제됩니다. 이 작업은
                                        되돌릴 수 없습니다.
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                      <div className="space-y-2">
                                        <Label htmlFor="confirm">
                                          확인을 위해 &quot;탈퇴합니다&quot;를
                                          입력하세요
                                        </Label>
                                        <Input
                                          id="confirm"
                                          placeholder="탈퇴합니다"
                                        />
                                      </div>
                                    </div>
                                    <DialogFooter>
                                      <Button
                                        variant="outline"
                                        onClick={() =>
                                          setShowDeleteConfirm(false)
                                        }
                                      >
                                        취소
                                      </Button>
                                      <Button
                                        variant="destructive"
                                        onClick={() => deleteProcess()}
                                      >
                                        회원 탈퇴 진행
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              </CardContent>
                            </Card>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
