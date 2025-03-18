"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ethers } from "ethers";
import {
  ArrowLeft,
  Heart,
  Share2,
  MapPin,
  Clock,
  ShoppingCart,
  AlertCircle,
  Minus,
  Plus,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PopularProducts } from "@/components/home/popular-products";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SSF_CONTRACT_ADDRESS } from "@/lib/api/web3";
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
import { Skeleton } from "@/components/ui/skeleton";

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
    description:
      "스타벅스 아메리카노 Tall 사이즈 기프티콘입니다. 유효기간은 구매일로부터 30일입니다.",
    image: "/placeholder.svg?height=600&width=600",
    expiryDate: "2023-12-31",
    location: "서울 강남구",
    distance: "1.2km",
    listedAt: "3시간 전",
    views: 24,
    isNew: true,
    isFavorite: false,
  };

  const [amount, setAmount] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [showPurchaseDialog, setShowPurchaseDialog] = useState<boolean>(false);
  const [purchaseStatus, setPurchaseStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const contractABI = ["function buyToken(uint256 amount) external payable"];

  const incrementAmount = () => {
    setAmount((prev) => prev + 1);
  };

  const decrementAmount = () => {
    if (amount > 1) {
      setAmount((prev) => prev - 1);
    }
  };

  const buyNFT = async () => {
    if (!window.ethereum) {
      setErrorMessage("MetaMask가 필요합니다.");
      setPurchaseStatus("error");
      return;
    }

    setPurchaseStatus("loading");
    setLoading(true);

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });

      const signer = await provider.getSigner();
      console.log("Connected Address:", await signer.getAddress());

      // 스마트 컨트랙트 인스턴스 생성
      const contract = new ethers.Contract(
        SSF_CONTRACT_ADDRESS,
        contractABI,
        signer
      );

      const pricePerToken = ethers.parseEther("0.000001");
      const totalPrice = pricePerToken * BigInt(amount);
      console.log("Sending ETH:", totalPrice.toString());

      // estimateGas를 사용하여 가스비를 계산
      let gasLimit;
      try {
        gasLimit = await contract.buyToken.estimateGas(amount, {
          value: totalPrice,
        });
        console.log("Estimated Gas:", gasLimit.toString());
      } catch (error) {
        console.error("estimateGas 실패:", error);
        setErrorMessage("가스비 계산 중 오류가 발생했습니다.");
        setPurchaseStatus("error");
        setLoading(false);
        return;
      }

      // `gasLimit`이 예상보다 낮게 설정되는 경우 대비하여 여유롭게 증가
      const gasBuffer = BigInt(50000);
      const finalGasLimit = gasLimit + gasBuffer;

      // 트랜잭션 실행
      try {
        const tx = await contract.buyToken(amount, {
          value: totalPrice,
          gasLimit: finalGasLimit,
        });
        await tx.wait();
        setPurchaseStatus("success");
      } catch (error) {
        console.error("구매 실패:", error);
        setErrorMessage("구매 중 오류가 발생했습니다.");
        setPurchaseStatus("error");
      }
    } catch (error) {
      console.error("Ethereum 연결 오류:", error);
      setErrorMessage("Ethereum 네트워크 연결 중 문제가 발생했습니다.");
      setPurchaseStatus("error");
    } finally {
      setLoading(false);
    }
  };

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
                src={product.image || "/placeholder.svg"}
                alt={product.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              {product.isNew && (
                <Badge className="absolute left-4 top-4 bg-blue-500 hover:bg-blue-600">
                  NEW
                </Badge>
              )}
            </div>

            <div className="flex flex-col rounded-lg bg-white p-6 shadow-sm">
              <div className="mb-2 text-sm text-muted-foreground">
                {product.category}
              </div>
              <h1 className="mb-4 text-2xl font-bold md:text-3xl">
                {product.title}
              </h1>

              <div className="mb-6">
                <span className="text-3xl font-bold">
                  {product.price.toLocaleString()}원
                </span>
                {product.originalPrice > product.price && (
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-sm line-through text-muted-foreground">
                      {product.originalPrice.toLocaleString()}원
                    </span>
                    <span className="text-sm text-primary">
                      {Math.round(
                        (1 - product.price / product.originalPrice) * 100
                      )}
                      % 할인
                    </span>
                  </div>
                )}
              </div>

              <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>
                  {product.location}{" "}
                  {product.distance && `· ${product.distance}`}
                </span>
              </div>

              <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>
                  등록일: {product.listedAt} · 조회 {product.views}회
                </span>
              </div>

              <div className="mb-6 rounded-lg bg-gray-50 p-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage
                      src={product.seller.avatar}
                      alt={product.seller.name}
                    />
                    <AvatarFallback>
                      {product.seller.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{product.seller.name}</div>
                    <div className="text-xs text-muted-foreground">
                      거래 {product.seller.transactions}회 · 평점{" "}
                      {product.seller.rating}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <div className="mb-2 text-sm font-medium">수량</div>
                <div className="flex items-center">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={decrementAmount}
                    disabled={amount <= 1}
                    className="h-10 w-10 rounded-r-none"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <div className="flex h-10 w-16 items-center justify-center border-y bg-white text-center">
                    {amount}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={incrementAmount}
                    className="h-10 w-10 rounded-l-none"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="mt-auto grid gap-4">
                <div className="flex gap-2">
                  <Dialog
                    open={showPurchaseDialog}
                    onOpenChange={setShowPurchaseDialog}
                  >
                    <DialogTrigger asChild>
                      <Button className="flex-1" size="lg">
                        <ShoppingCart className="mr-2 h-5 w-5" /> 구매하기
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>NFT 기프티콘 구매</DialogTitle>
                        <DialogDescription>
                          {product.title} {amount}개를 구매합니다.
                        </DialogDescription>
                      </DialogHeader>

                      <div className="py-4">
                        <div className="mb-4 rounded-lg bg-gray-50 p-4">
                          <div className="flex justify-between mb-2">
                            <span className="text-sm text-muted-foreground">
                              상품명
                            </span>
                            <span className="font-medium">{product.title}</span>
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
                              {(product.price * amount).toLocaleString()}원
                            </span>
                          </div>
                          <div className="flex justify-between pt-2 border-t">
                            <span className="font-medium">총 결제금액</span>
                            <span className="text-lg font-bold text-primary">
                              {(product.price * amount).toLocaleString()}원
                            </span>
                          </div>
                        </div>

                        {purchaseStatus === "error" && (
                          <Alert variant="destructive" className="mb-4">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>오류</AlertTitle>
                            <AlertDescription>{errorMessage}</AlertDescription>
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
                          onClick={buyNFT}
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

                  <Button
                    variant="outline"
                    size="icon"
                    className="h-12 w-12"
                    aria-label={product.isFavorite ? "찜 해제하기" : "찜하기"}
                  >
                    <Heart
                      className={`h-5 w-5 ${
                        product.isFavorite ? "fill-primary text-primary" : ""
                      }`}
                    />
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    className="h-12 w-12"
                    aria-label="공유하기"
                  >
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="w-full justify-start border-b bg-transparent p-0">
                <TabsTrigger
                  value="description"
                  className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  상품 설명
                </TabsTrigger>
                <TabsTrigger
                  value="seller"
                  className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  판매자 정보
                </TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  거래 후기
                </TabsTrigger>
              </TabsList>

              <TabsContent
                value="description"
                className="mt-6 rounded-lg bg-white p-6 shadow-sm"
              >
                <div className="prose max-w-none">
                  <p>{product.description}</p>
                  <ul>
                    <li>유효기간: {product.expiryDate}</li>
                    <li>사용 가능 매장: 전국 스타벅스 매장</li>
                    <li>교환 및 환불: 구매 후 7일 이내 가능</li>
                  </ul>
                </div>
              </TabsContent>

              <TabsContent
                value="seller"
                className="mt-6 rounded-lg bg-white p-6 shadow-sm"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage
                        src={product.seller.avatar}
                        alt={product.seller.name}
                      />
                      <AvatarFallback>
                        {product.seller.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-medium">
                        {product.seller.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        거래 {product.seller.transactions}회 · 평점{" "}
                        {product.seller.rating}
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

              <TabsContent
                value="reviews"
                className="mt-6 rounded-lg bg-white p-6 shadow-sm"
              >
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    아직 거래 후기가 없습니다.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="mt-16">
            <h2 className="mb-8 text-2xl font-bold">비슷한 상품</h2>
            <PopularProducts />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
