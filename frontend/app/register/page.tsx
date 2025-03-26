"use client";

import { useState, useRef, useEffect } from "react";
import { getUserNFTsAsJson } from "@/lib/api/web3";
import { RegisterPageLayout } from "@/components/registerArticle/RegisterPageLayout";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import axios from "axios";
import { useRouter } from "next/navigation";

// 지갑 주소 가져오기
async function getWalletAddress() {
  if (typeof window.ethereum !== "undefined") {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    return accounts[0];
  }
  return null;
}

// IPFS 주소 변환
const convertIpfsUrl = (url: string) => {
  if (!url) return "/placeholder.svg";
  return url.startsWith("ipfs://")
    ? `https://ipfs.io/ipfs/${url.substring(7)}`
    : url;
};

export default function RegisterPage() {
  const [ownedGifticons, setOwnedGifticons] = useState<any[]>([]);
  const [selectedGifticon, setSelectedGifticon] = useState<string | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchNFTs = async () => {
      try {
        const address = await getWalletAddress();
        if (!address) {
          console.error("❌ 지갑 주소 없음");
          return;
        }

        const nfts = await getUserNFTsAsJson(address);
        const formatted = nfts.map((nft) => ({
          ...nft,
          image: convertIpfsUrl(nft.image),
        }));
        setOwnedGifticons(formatted);
      } catch (error) {
        console.error("NFT 로딩 실패:", error);
      }
    };

    fetchNFTs();
  }, []);

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

    console.log("🟢 등록 요청 데이터:", payload);

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        alert("로그인이 필요합니다.");
        return;
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/secondhand-articles`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("✅ 게시글이 성공적으로 등록되었습니다!");
      router.push("/articles");
      console.log("📌 응답:", response.data);
    } catch (error) {
      console.error("❌ 게시글 등록 실패:", error);
      alert("게시글 등록에 실패했습니다.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-8">
        <RegisterPageLayout
          gifticons={ownedGifticons}
          selected={selectedGifticon}
          selectedData={selectedGifticonData}
          onSelect={setSelectedGifticon}
          onSubmit={handleFormSubmit}
          carouselRef={carouselRef}
          onScroll={handleScroll}
        />
      </main>
      <Footer />
    </div>
  );
}
