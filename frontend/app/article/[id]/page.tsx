"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Share2,
  Clock,
  ShoppingCart,
  AlertCircle,
  Gift,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PopularArticles } from "@/components/home/popular-articles";
import { buyNFT, fetchTokenInfoBySerial } from "@/lib/api/web3";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { useLoading } from "@/components/LoadingContext"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


type ArticleDetail = {
  articleId: number
  serialNum: number
  title: string
  description: string
  userId: number
  expirationDate: string
  imageUrl: string
  countLikes: number
  currentPrice: number
  createAt: string
  viewCnt: number
  originalPrice: number
  brandName: string
  categoryName: string
  isLiked: boolean
  userNickName: string
  profileImage : string

};

export default function ArticlePage({ params }: { params: { id: string } }) {
  const { id } = params;


  const [amount, setAmount] = useState<number>(1)
  const [loading, setLoading] = useState<boolean>(false)
  const [showPurchaseDialog, setShowPurchaseDialog] = useState<boolean>(false)
  const [purchaseStatus, setPurchaseStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [article, setArticle] = useState<ArticleDetail | null>(null)
  const [isLiked, setIsLiked] = useState<boolean>(false)
  const [countLikes, setLikeCount] = useState<number>(0)
  const { isLoading, setIsLoading } = useLoading()


  const contractABI = ["function buyToken(uint256 amount) external payable"]
  console.log(article)

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setIsLoading(true); // 로딩 시작

        const accessToken = localStorage.getItem("access_token");
        const headers: HeadersInit = accessToken
          ? { Authorization: `Bearer ${accessToken}` }
          : {};

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/secondhand-articles/${id}`,
          {
            headers,
          }
        );

        if (!res.ok) throw new Error("Failed to fetch article");
        const data = await res.json();
        setArticle(data);
        setIsLiked(data.liked);
        setLikeCount(data.countLikes);
      } catch (error) {
        console.error("Error fetching article:", error);
      } finally {
        setIsLoading(false); // 로딩 종료
      }
    };

    fetchArticle();
  }, [id]);

  // 좋아요 클릭
  const handleLikeToggle = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    const token = localStorage.getItem("access_token");

    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }
    const method = isLiked ? "DELETE" : "POST";

    // 관심 - UI 업데이트
    setIsLiked(!isLiked);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/secondhand-articles/${article?.articleId}/likes`,
      {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      console.warn("좋아요 토글 실패");
      setIsLiked((prev) => !prev);
      setLikeCount((prev) => (isLiked ? prev + 1 : prev - 1)); // 롤백도 같이
    }
  };

  const incrementAmount = () => {
    setAmount((prev) => prev + 1);
  };

  const decrementAmount = () => {
    if (amount > 1) {
      setAmount((prev) => prev - 1);
    }
  };

  const handleBuyNFT = async (serialNumber: number) => {
    if (!window.ethereum) {
      setErrorMessage("MetaMask가 필요합니다.");
      setPurchaseStatus("error");
      return;
    }

    setPurchaseStatus("loading");
    setLoading(true);

    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });

      const success = await buyNFT(serialNumber);

      if (success) {
        setPurchaseStatus("success");
        const tokenInfo = await fetchTokenInfoBySerial(serialNumber);
        if (tokenInfo) {
          console.log("🧾 [Token Info]");
          console.log("🎯 Token ID:", tokenInfo.tokenId.toString());
          console.log("📛 이름:", tokenInfo.name);
          console.log("📝 설명:", tokenInfo.description);
          console.log("📦 총 발행량:", tokenInfo.totalSupply.toString());
          console.log("🔗 메타데이터 URI:", tokenInfo.metadataURI);
        } else {
          console.warn("⚠️ 토큰 정보를 불러오지 못했습니다.");
        }
      } else {
        setErrorMessage("구매에 실패했습니다.");
        setPurchaseStatus("error");
      }
    } catch (error) {
      console.error("❌ Ethereum 연결 오류:", error);
      setErrorMessage("Ethereum 네트워크 연결 중 문제가 발생했습니다.");
      setPurchaseStatus("error");
    } finally {
      setLoading(false);
    }
  };

  // 공유 버튼
  const shareBtn = async () => {
    try {
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      alert("현재 페이지 URL이 복사되었습니다!");
    } catch (err) {
      console.error("URL 복사 실패:", err);
      alert("URL 복사에 실패했습니다.");
    }
  };

  if (!article) {
    return <div className="p-10 text-center">로딩 중...</div>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gray-50">
        <div className="container py-8">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" /> 돌아가기
          </Link>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-white shadow-sm">
              <Image
                src={article.imageUrl || "/placeholder.svg"}
                alt={article.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              {/* {article.isNew && <Badge className="absolute left-4 top-4 bg-blue-500 hover:bg-blue-600">NEW</Badge>} */}
            </div>

            <div className="flex flex-col rounded-lg bg-white p-6 shadow-sm">
              <div className="mb-2 text-sm text-muted-foreground">
                {article.categoryName}
              </div>
              <h1 className="mb-4 text-2xl font-bold md:text-3xl">
                {article.title}
              </h1>

              <div className="mb-6">
                <span className="text-3xl font-bold">{(article.currentPrice ?? 0).toLocaleString()}원</span>
                {article.originalPrice > article.currentPrice && (
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-sm line-through text-muted-foreground">
                      {article.originalPrice.toLocaleString()}원
                    </span>
                    <span className="text-sm text-primary">
                      {Math.round((1 - article.currentPrice / article.originalPrice) * 100)}% 할인
                    </span>
                  </div>
                )}
              </div>

              <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>
                  등록일: {article.createAt} · 조회 {article.viewCnt}회 · 관심{" "}
                  {countLikes}
                </span>
              </div>

              <h1 className="font-bold mb-2 mt-6">상품 상세 설명</h1>
              <div className="mb-6 rounded-lg bg-gray-50 p-4">
                <p className="text-sm text-gray-600 mb-4">{article.description}</p>
                <div className="mt-3 text-sm">
                  <span className="font-medium">유효기간:</span> {article.expirationDate}
                </div>
              </div>

              <div className="mt-auto">
                <div className="grid grid-cols-12 gap-1">
                  <div className="col-span-5">
                    <Dialog
                      open={showPurchaseDialog}
                      onOpenChange={setShowPurchaseDialog}
                    >
                      <DialogTrigger asChild>
                        <Button className="h-12 w-full px-[16px]" size="lg">
                          <ShoppingCart className="mr-1 h-4 w-4" /> 구매하기
                        </Button>
                      </DialogTrigger>

                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>NFT 기프티콘 구매</DialogTitle>
                          <DialogDescription>
                            {article.title} {amount}개를 구매합니다.
                          </DialogDescription>
                        </DialogHeader>

                        <div className="py-4">
                          <div className="mb-4 rounded-lg bg-gray-50 p-4">
                            <div className="flex justify-between mb-2">
                              <span className="text-sm text-muted-foreground">
                                상품명
                              </span>
                              <span className="font-medium">
                                {article.title}
                              </span>
                            </div>
                            <div className="flex justify-between mb-2">
                              <span className="text-sm text-muted-foreground">
                                수량
                              </span>
                              <span className="font-medium">{amount}개</span>
                            </div>
                            <div className="flex justify-between mb-2">
                              <span className="text-sm text-muted-foreground">
                                가격
                              </span>
                              <span className="font-medium">
                                {(
                                  article.currentPrice * amount
                                ).toLocaleString()}
                                원
                              </span>
                            </div>
                            <div className="flex justify-between pt-2 border-t">
                              <span className="font-medium">총 결제금액</span>
                              <span className="text-lg font-bold text-primary">
                                {(
                                  article.currentPrice * amount
                                ).toLocaleString()}
                                원
                              </span>
                            </div>
                          </div>

                          {purchaseStatus === "error" && (
                            <Alert variant="destructive" className="mb-4">
                              <AlertCircle className="h-4 w-4" />
                              <AlertTitle>오류</AlertTitle>
                              <AlertDescription>
                                {errorMessage}
                              </AlertDescription>
                            </Alert>
                          )}

                          {purchaseStatus === "success" && (
                            <Alert className="mb-4 border-green-200 bg-green-50 text-green-800">
                              <AlertCircle className="h-4 w-4" />
                              <AlertTitle>구매 완료</AlertTitle>
                              <AlertDescription>
                                {amount}개의 NFT를 성공적으로 구매했습니다!
                              </AlertDescription>
                            </Alert>
                          )}
                        </div>

                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setPurchaseStatus("idle");
                              setShowPurchaseDialog(false);
                            }}
                            disabled={loading}
                          >
                            취소
                          </Button>
                          <Button
                            onClick={() => handleBuyNFT(article.serialNum)}
                            disabled={loading || purchaseStatus === "success"}
                          >
                            {loading ? (
                              <>
                                <Skeleton className="h-4 w-4 mr-2 rounded-full animate-spin" />
                                처리 중...
                              </>
                            ) : purchaseStatus === "success" ? (
                              "구매 완료"
                            ) : (
                              "구매 확인"
                            )}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="col-span-5">
                    <Link
                      href={`/gift/${params.id}/customize`}
                      className="block"
                    >
                      <Button
                        variant="outline"
                        className="h-12 w-full px-[16px]"
                        size="lg"
                      >
                        <Gift className="mr-1 h-4 w-4" /> 선물하기
                      </Button>
                    </Link>
                  </div>

                  <div className="col-span-1">
                    <Button
                      onClick={handleLikeToggle}
                      variant="outline"
                      size="icon"
                      className="h-12 w-full"
                      aria-label={article.isLiked ? "찜 해제하기" : "찜하기"}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={cn(
                          "h-4 w-4",
                          isLiked
                            ? "fill-red-500 text-red-500"
                            : "text-gray-500"
                        )}
                        fill={isLiked ? "currentColor" : "none"}
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
                  </div>

                  <div className="col-span-1">
                    <Button
                      onClick={shareBtn}
                      variant="outline"
                      size="icon"
                      className="h-12 w-full"
                      aria-label="공유하기"
                    >
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
          <Tabs defaultValue="seller" className="w-full">
              <TabsList className="w-full justify-start border-b bg-transparent p-0">
                <TabsTrigger
                  value="seller"
                  className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  판매자 정보
                </TabsTrigger>
              </TabsList>

              <TabsContent value="seller" className="mt-6 rounded-lg bg-white p-6 shadow-sm">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={article.profileImage} alt={article.profileImage} />
                      <AvatarFallback>{article.userNickName}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-medium">{article.userNickName}</h3>
                      {/* 거래 횟수가 없는거 같아서 임시로 viewCnt로 해놨음 */}
                      <p className="text-sm text-muted-foreground">
                        거래 {article.viewCnt}회 
                        {/* · */}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium">판매자의 다른 상품</h4>
                    <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                      {/* 판매자의 다른 상품들 */}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="mt-16">
            <h2 className="mb-8 text-2xl font-bold">비슷한 상품</h2>
            <PopularArticles />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
