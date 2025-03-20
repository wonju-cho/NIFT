"use client";

import { useState, useRef, useEffect } from "react";
import { getUserNFTsAsJson } from "@/lib/api/web3"; // NFT 관련 함수 임포트
import Image from "next/image";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import * as React from "react";

// Radix UI components
import * as LabelPrimitive from "@radix-ui/react-label";

// Utility functions
import { cn } from "@/lib/utils";

// Layout components
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

// ✅ Metamask에서 지갑 주소 가져오기 함수
async function getWalletAddress() {
  if (typeof window.ethereum !== "undefined") {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    return accounts[0];
  }
  return null;
}

// ✅ IPFS URL 변환 함수
const convertIpfsUrl = (url: string) => {
  if (!url) return "/placeholder.svg"; // URL이 없을 경우 기본 이미지 반환
  if (url.startsWith("ipfs://")) {
    return `https://ipfs.io/ipfs/${url.substring(7)}`;
  }
  return url;
};

// Sample data - owned gift cards with more details
const ownedGifticons = [
  // {
  //   id: "1",
  //   title: "스타벅스 아메리카노 Tall",
  //   serialNum: "1-1234",
  //   brand: "스타벅스",
  //   category: "커피/음료",
  //   expiryDate: "2023-12-31",
  //   image: "/placeholder.svg?height=200&width=200",
  // },
  // {
  //   id: "2",
  //   title: "배스킨라빈스 파인트",
  //   serialNum: "2-1234",
  //   brand: "배스킨라빈스",
  //   category: "뷰티/아이스크림",
  //   expiryDate: "2023-11-30",
  //   image: "/placeholder.svg?height=200&width=200",
  // },
  // {
  //   id: "3",
  //   title: "맥도날드 빅맥 세트",
  //   brand: "맥도날드",
  //   serialNum: "3-1234",
  //   category: "치킨/피자/버거",
  //   expiryDate: "2023-10-15",
  //   image: "/placeholder.svg?height=200&width=200",
  // },
  // {
  //   id: "4",
  //   serialNum: "4-1234",
  //   title: "CGV 영화 관람권",
  //   brand: "CGV",
  //   category: "문화/생활",
  //   expiryDate: "2023-12-15",
  //   image: "/placeholder.svg?height=200&width=200",
  // },
  // {
  //   id: "5",
  //   serialNum: "5-1234",
  //   title: "GS25 5천원 금액권",
  //   brand: "GS25",
  //   category: "편의점/마트",
  //   expiryDate: "2023-09-30",
  //   image: "/placeholder.svg?height=200&width=200",
  // },
  // {
  //   id: "6",
  //   serialNum: "6-1234",
  //   title: "투썸플레이스 아메리카노",
  //   brand: "투썸플레이스",
  //   category: "커피/음료",
  //   expiryDate: "2023-11-15",
  //   image: "/placeholder.svg?height=200&width=200",
  // },
  // {
  //   id: "6",
  //   serialNum: "6-1235",
  //   title: "투썸플레이스 아메리카노",
  //   brand: "투썸플레이스",
  //   category: "커피/음료",
  //   expiryDate: "2023-11-15",
  //   image: "/placeholder.svg?height=200&width=200",
  // },
  // {
  //   id: "6",
  //   serialNum: "1-1236",
  //   title: "투썸플레이스 아메리카노",
  //   brand: "투썸플레이스",
  //   category: "커피/음료",
  //   expiryDate: "2023-11-15",
  //   image: "/placeholder.svg?height=200&width=200",
  // },
  // {
  //   id: "6",
  //   serialNum: "1-1237",
  //   title: "투썸플레이스 아메리카노",
  //   brand: "투썸플레이스",
  //   category: "커피/음료",
  //   expiryDate: "2023-11-15",
  //   image: "/placeholder.svg?height=200&width=200",
  // },
  // {
  //   id: "6",
  //   serialNum: "1-1238",
  //   title: "투썸플레이스 아메리카노",
  //   brand: "투썸플레이스",
  //   category: "커피/음료",
  //   expiryDate: "2023-11-15",
  //   image: "/placeholder.svg?height=200&width=200",
  // },
  // {
  //   id: "6",
  //   serialNum: "1-1239",
  //   title: "투썸플레이스 아메리카노",
  //   brand: "투썸플레이스",
  //   category: "커피/음료",
  //   expiryDate: "2023-11-15",
  //   image: "/placeholder.svg?height=200&width=200",
  // },
];

// Label component
const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(
      "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className
    )}
    {...props}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;

// Input component
const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

// Textarea component
const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

// Button component
const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?:
      | "default"
      | "destructive"
      | "outline"
      | "secondary"
      | "ghost"
      | "link";
    size?: "default" | "sm" | "lg" | "icon";
  }
>(({ className, variant = "default", size = "default", ...props }, ref) => {
  const variantStyles = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    destructive:
      "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    outline:
      "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "text-primary underline-offset-4 hover:underline",
  };

  const sizeStyles = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = "Button";

// Card components
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6", className)} {...props} />
));
CardContent.displayName = "CardContent";

// Separator component
const Separator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("h-[1px] w-full bg-border", className)}
    {...props}
  />
));
Separator.displayName = "Separator";

export default function RegisterPage() {
  const [ownedGifticons, setOwnedGifticons] = useState<any[]>([]); // ✅ NFT 데이터 저장
  const [selectedGifticon, setSelectedGifticon] = useState<string | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchNFTs = async () => {
      try {
        const userAddress = await getWalletAddress();
        if (!userAddress) {
          console.error("❌ 지갑 주소를 가져올 수 없음");
          return;
        }

        const tokenIds = Array.from({ length: 10 }, (_, i) => i + 1); // ✅ 1~10번 ID 조회
        const nfts = await getUserNFTsAsJson(userAddress, tokenIds); // ✅ 사용자의 NFT 정보 가져오기

        console.log("📌 NFT 데이터:", nfts); // 🔥 콘솔 로그 추가 (확인 필수)

        // ✅ 데이터 변환: 이미지 URL 변환 및 serialNum 등 처리
        const formattedNFTs = nfts.map((nft) => ({
          ...nft,
          image: convertIpfsUrl(nft.image), // IPFS URL 변환
        }));

        setOwnedGifticons(formattedNFTs); // ✅ NFT 데이터로 상태 업데이트
      } catch (error) {
        console.error("❌ NFT 데이터 로딩 실패:", error);
      }
    };

    fetchNFTs();
  }, []);

  const handleGifticonSelect = (serialNum: string) => {
    setSelectedGifticon(serialNum);
  };

  const scrollCarousel = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = 300; // Adjust as needed
      const currentScroll = carouselRef.current.scrollLeft;

      carouselRef.current.scrollTo({
        left:
          direction === "left"
            ? currentScroll - scrollAmount
            : currentScroll + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const selectedGifticonData = selectedGifticon
    ? ownedGifticons.find((g) => g.serialNum === selectedGifticon)
    : null;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-2">
            {/* 왼쪽: 선택한 기프티콘 상세정보 */}
            <div className="h-full">
              <h2 className="mb-4 text-xl font-bold">
                선택한 기프티콘 상세정보
              </h2>
              <Card className="h-[500px] flex items-center justify-center">
                {selectedGifticonData ? (
                  <div className="text-center w-full h-full flex flex-col justify-center p-4">
                    <div className="flex-1 flex items-center justify-center">
                      <Image
                        src={convertIpfsUrl(selectedGifticonData.image)} // ✅ IPFS 변환 적용
                        alt="선택된 기프티콘"
                        width={250}
                        height={250}
                        className="object-contain"
                      />
                    </div>
                    <div className="bg-white rounded-lg p-4 max-w-md mx-auto">
                      <h3 className="text-lg font-medium mb-2">
                        {selectedGifticonData.title}
                      </h3>
                      <div className="space-y-2 text-left">
                        <div className="grid grid-cols-3 gap-2">
                          <span className="text-sm font-medium text-gray-500">
                            브랜드:
                          </span>
                          <span className="text-sm col-span-2">
                            {selectedGifticonData.brand}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <span className="text-sm font-medium text-gray-500">
                            카테고리:
                          </span>
                          <span className="text-sm col-span-2">
                            {selectedGifticonData.category}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <span className="text-sm font-medium text-gray-500">
                            유효기간:
                          </span>
                          <span className="text-sm col-span-2">
                            {selectedGifticonData.expiryDate}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <span className="text-sm font-medium text-gray-500">
                            시리얼번호:
                          </span>
                          <span className="text-sm col-span-2">
                            {selectedGifticonData.serialNum}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground">
                    <p>아래에서 기프티콘을 선택하세요</p>
                  </div>
                )}
              </Card>
            </div>

            {/* 오른쪽: 작성할 게시글 내용 */}
            <div className="h-full">
              <h2 className="mb-4 text-xl font-bold">작성할 게시글 내용</h2>
              <Card className="h-[500px]">
                <CardContent className="p-6 h-full flex flex-col">
                  <div className="space-y-4 flex-1 flex flex-col">
                    <div>
                      <Label htmlFor="title" className="mb-2 block">
                        제목
                      </Label>
                      <Input
                        id="title"
                        type="text"
                        placeholder="제목을 입력하세요"
                      />
                    </div>

                    <div>
                      <Label htmlFor="price" className="mb-2 block">
                        가격
                      </Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="가격을 입력하세요 (소수점 입력 가능)"
                      />
                    </div>

                    <div className="flex-1">
                      <Label htmlFor="description" className="mb-2 block">
                        게시글 내용
                      </Label>
                      <Textarea
                        id="description"
                        placeholder="상품에 대한 상세 설명을 입력하세요"
                        className="h-[200px] resize-none"
                      />
                    </div>

                    <div className="pt-4 pb-6">
                      <Button className="w-full text-white" size="lg">
                        상품 등록하기
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator className="my-8" />

          {/* 보유중인 기프티콘 - 캐러셀 구조 */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">보유중인 기프티콘</h2>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => scrollCarousel("left")}
                  aria-label="이전 기프티콘"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => scrollCarousel("right")}
                  aria-label="다음 기프티콘"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="relative">
              {ownedGifticons.length === 0 ? (
                <p className="text-center text-gray-500">
                  보유한 NFT 기프티콘이 없습니다.
                </p>
              ) : (
                <div
                  ref={carouselRef}
                  className="flex overflow-x-auto gap-4 pb-4"
                  // style={{ scrollbarHeight: "8px" }}
                >
                  {ownedGifticons.map((gifticon) => (
                    <div
                      key={gifticon.serialNum}
                      className={`cursor-pointer rounded-lg border p-4 transition-all hover:border-primary flex-shrink-0 w-[200px] ${
                        selectedGifticon === gifticon.serialNum
                          ? "border-primary bg-primary/5"
                          : ""
                      }`}
                      onClick={() => handleGifticonSelect(gifticon.serialNum)}
                    >
                      <div className="relative">
                        <div className="aspect-square overflow-hidden rounded-md bg-gray-200">
                          <Image
                            src={convertIpfsUrl(gifticon.image)} // ✅ IPFS 변환 적용
                            alt={gifticon.title}
                            width={200}
                            height={200}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        {selectedGifticon === gifticon.serialNum && (
                          <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white">
                            <Check className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                      <div className="mt-2">
                        <h3 className="text-sm font-medium">
                          {gifticon.title}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          유효기간: {gifticon.expiryDate}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
