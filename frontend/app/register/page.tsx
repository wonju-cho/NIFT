"use client";

import { useState, useRef, useEffect } from "react";
import { getUserNFTsAsJson } from "@/lib/api/web3";
import { RegisterPageLayout } from "@/components/registerArticle/RegisterPageLayout";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import axios from "axios";
import { useRouter } from "next/navigation";
import { listGifticonForSale } from "@/lib/api/web3";
import { useLoading } from "@/components/LoadingContext";
import Image from "next/image";
import { Button } from "@/components/ui/button";

async function getWalletAddress() {
  if (typeof window.ethereum !== "undefined") {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    return accounts[0];
  }
  return null;
}

const convertIpfsUrl = (url: string) => {
  if (!url) return "/placeholder.svg";
  return url.startsWith("ipfs://")
    ? `https://ipfs.io/ipfs/${url.substring(7)}`
    : url;
};

export default function RegisterPage() {
  const { isLoading, setIsLoading } = useLoading();
  const [ownedGifticons, setOwnedGifticons] = useState<any[]>([]);
  const [selectedGifticon, setSelectedGifticon] = useState<string | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [accessToken, setAccessToken] = useState<null | string | "loading">(
    "loading"
  );
  const [dbWalletAddress, setDbWalletAddress] = useState<string | null>(null);
  const [metamaskAddress, setMetamaskAddress] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setAccessToken(token || null);
  }, []);

  useEffect(() => {
    const fetchWallets = async () => {
      if (!accessToken) return;

      // DB 지갑 주소 불러오기
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const data = await res.json();
        setDbWalletAddress(data.walletAddress || null);
      } catch (e) {
        console.error("❌ DB 지갑주소 불러오기 실패:", e);
      }

      // 메타마스크 주소 불러오기
      try {
        const address = await getWalletAddress();
        setMetamaskAddress(address);
      } catch (e) {
        console.error("❌ 메타마스크 주소 가져오기 실패:", e);
      }
    };

    fetchWallets();
  }, [accessToken]);

  useEffect(() => {
    const fetchNFTs = async () => {
      try {
        const address = await getWalletAddress();
        if (!address) return;

        const nfts = await getUserNFTsAsJson(address);
        const formatted = nfts
          .map((nft) => ({
            ...nft,
            image: convertIpfsUrl(nft.image),
            isSelling:
              Number(nft.price) > 0 &&
              nft.seller !== "0x0000000000000000000000000000000000000000",
          }))
          .sort((a, b) => (a.isSelling ? 1 : -1));

        setOwnedGifticons(formatted);
      } catch (error) {
        console.error("NFT 로딩 실패:", error);
      }
    };

    if (accessToken) fetchNFTs();
  }, [accessToken]);

  const selectedGifticonData = selectedGifticon
    ? ownedGifticons.find((g) => g.serialNum === selectedGifticon)
    : null;

  const handleScroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const amount = 300;
      const current = carouselRef.current.scrollLeft;
      carouselRef.current.scrollTo({
        left: direction === "left" ? current - amount : current + amount,
        behavior: "smooth",
      });
    }
  };

  const handleFormSubmit = async (data: {
    title: string;
    price: number;
    description: string;
  }) => {
    if (!selectedGifticonData) {
      alert("기프티콘을 선택하세요!");
      return;
    }

    const payload = {
      title: data.title,
      description: data.description,
      currentPrice: data.price,
      serialNum: Number(selectedGifticonData.serialNum),
      expirationDate: `${selectedGifticonData.expiryDate}T23:59:59`,
      gifticonId: Number(selectedGifticonData.id),
      imageUrl: selectedGifticonData.image,
    };

    setIsLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        alert("로그인이 필요합니다.");
        return;
      }

      await listGifticonForSale(payload.serialNum, payload.currentPrice);

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/secondhand-articles`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("게시글이 성공적으로 등록되었습니다!");
      router.push("/articles");
    } catch (error) {
      console.error("❌ 게시글 등록 실패:", error);
      alert("게시글 등록에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-12">
        <div className="container">
          {accessToken === "loading" ? null : !accessToken ? (
            <div className="flex flex-col items-center justify-center h-[70vh]">
              <Image src="/1.svg" alt="로그인 필요" width={120} height={120} />
              <p className="mt-4 text-lg font-semibold">로그인이 필요합니다!</p>
              <Button className="mt-4" onClick={() => router.push("/signin")}>
                로그인 하러 가기
              </Button>
            </div>
          ) : dbWalletAddress === null ? (
            <div className="flex flex-col items-center justify-center h-[70vh] text-center">
              <Image src="/1.svg" alt="지갑 없음" width={120} height={120} />
              <p className="mt-4 text-lg font-semibold">
                지갑이 등록되어 있지 않습니다.
              </p>
              <Button className="mt-4" onClick={() => router.push("/mypage")}>
                지갑 등록하러 가기
              </Button>
            </div>
          ) : metamaskAddress?.toLowerCase() !==
            dbWalletAddress.toLowerCase() ? (
            <div className="flex flex-col items-center justify-center h-[70vh] text-center">
              <Image src="/1.svg" alt="주소 불일치" width={120} height={120} />
              <p className="mt-4 text-lg font-semibold text-red-600">
                현재 연결된 지갑이 등록된 지갑과 다릅니다.
              </p>
              <p className="text-sm mt-2 text-muted-foreground">
                등록된 지갑으로 다시 연결해주세요.
              </p>
              <Button className="mt-4" onClick={() => router.push("/mypage")}>
                지갑 다시 연결하기
              </Button>
            </div>
          ) : (
            <RegisterPageLayout
              gifticons={ownedGifticons}
              selected={selectedGifticon}
              selectedData={selectedGifticonData}
              onSelect={setSelectedGifticon}
              onSubmit={handleFormSubmit}
              carouselRef={carouselRef}
              onScroll={handleScroll}
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
