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
  ProductCard,
  ProductCardProps,
} from "@/components/product/product-card";
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
  fetchLikedProducts,
} from "@/lib/api/mypage";
import { useRouter } from "next/navigation";

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
  const [likedProducts, setLikedProducts] = useState<ProductCardProps[]>([]);
  const [totalPage, setTotalPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);

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

      if (!kakaoAccessToken) {
        console.error("카카오 토큰이 없습니다.");
        return;
      }

      const response = await fetch(`${BASE_URL}/users/me`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${kakaoAccessToken}`, // ✅ kakao_access_token을 Authorization 헤더에 포함
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
    const loadLikeProducts = async () => {
      setIsLoading(true);
      try {
        const data = await fetchLikedProducts(currentPage);

        const transformedProducts = data.likes.map((product) => ({
          productId: product.productId,
          title: product.title,
          brandName: "", // 브랜드 정보가 없을 경우 빈 문자열
          currentPrice: product.currentPrice,
          originalPrice: product.currentPrice, // 원래 가격이 없으면 현재 가격으로 설정
          discountRate: 0, // 할인율 기본값 설정
          imageUrl: product.imageUrl,
          isLiked: true, // 찜한 상품이므로 true
        }));

        setLikedProducts(transformedProducts);
        setTotalPage(data?.totalPage || 1);
      } catch (error) {
        console.error("찜한 상품 목록 가져오는데 에러 생김!! : ", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadLikeProducts();
  }, [currentPage]);

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
                              <div className="flex gap-2">
                                <Input
                                  id="name"
                                  value={nickname}
                                  onChange={(e) => setNickname(e.target.value)}
                                />
                                <Button
                                  className="whitespace-nowrap"
                                  onClick={updateNickname}
                                >
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
                                  onClick={connectOrUpdateWallet}
                                >
                                  {walletAddress ? "변경하기" : "연결하기"}
                                </Button>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={copyToClipboard}
                                >
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
                          {/* <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                          {myProducts.slice(0, 3).map((product) => (
                            <ProductCard key={product.id} {...product} />
                          ))}
                        </div> */}
                        </TabsContent>

                        <TabsContent value="sales" className="mt-6">
                          <div>
                            <h2 className="mb-4 text-xl font-semibold">
                              판매 내역
                            </h2>
                            <p className="mb-6 text-sm text-muted-foreground">
                              판매 중인 기프티콘과 판매 완료된 기프티콘을 확인할
                              수 있습니다.
                            </p>
                          </div>
                          {/* <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                          {myProducts.slice(1, 4).map((product) => (
                            <ProductCard key={product.id} {...product} />
                          ))}
                        </div> */}
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

                          {/* 찜한 상품 목록 표시 */}
                          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {likedProducts?.length > 0 ? (
                              likedProducts.map((product) => (
                                <ProductCard
                                  key={product.productId}
                                  {...product}
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
