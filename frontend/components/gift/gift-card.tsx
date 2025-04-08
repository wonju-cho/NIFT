"use client";

import { useNft, UserNFT } from "@/lib/api/web3";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import QrScanner from "../ui/QrScanner";
import { apiClient } from "@/lib/api/CustomAxios";
import { useLoading } from "../LoadingContext";

interface GiftCardProps {
  expiryDays: string;
  card: UserNFT;
  onGifticonUsed?: (serialNum: number) => void;
}

export function GiftCard({ expiryDays, card, onGifticonUsed }: GiftCardProps) {
  const router = useRouter();
  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false);
  const { isLoading, setIsLoading } = useLoading();

  const handleGift = async (tokenId: number) => {
    try {
      router.push(`/gift/${tokenId}/customize?type=gifticon`);
    } catch (error) {
      console.error("gifticonId 조회 실패:", error);
      alert("기프티콘 정보를 가져오지 못했습니다.");
    }
  };

  const handleUseNft = async (walletAddress: string) => {
    setIsLoading(true);
    const response = await useNft(Number(card.serialNum), walletAddress);
    if (response.success) {
      alert("사용이 완료되었습니다.");
      await apiClient.post(`/users/gifticons/${response.txHash}`);
      onGifticonUsed?.(Number(card.serialNum));
    }
    setIsLoading(false);
  };

  const onScanSuccessHandler = useCallback(
    (walletAddress: string) => {
      // 파라미터 타입 명시
      console.log("✅ 인식된 지갑 주소:", walletAddress);
      setIsQrScannerOpen(false);
      handleUseNft(walletAddress);
    },
    [handleUseNft, setIsQrScannerOpen]
  );

  return (
    <div className="group relative overflow-hidden rounded-lg border bg-white transition-all hover:shadow-md">
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={card.image || "/placeholder.svg"}
          alt={card.title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {expiryDays && (
          <div className="absolute left-2 top-2 rounded bg-gray-700 px-2 py-1 text-xs text-white">
            {expiryDays}
          </div>
        )}
        {card.redeemed && (
          <>
            <div className="absolute inset-0 bg-black/30"></div>
            <div
              className="absolute left-2 top-2 rounded px-2 py-1 text-xs text-white font-medium"
              style={{ backgroundColor: "#dd5851" }}
            >
              사용 완료
            </div>
          </>
        )}
        {card.isPending && (
          <>
            <div className="absolute inset-0 bg-black/30"></div>
            <div
              className="absolute left-2 top-2 rounded px-2 py-1 text-xs text-white font-medium"
              style={{ backgroundColor: "#dd5851" }}
            >
              선물 대기 중
            </div>
          </>
        )}
        {card.isSelling && (
          <>
            <div className="absolute inset-0 bg-black/30"></div>
            <div
              className="absolute left-2 top-2 rounded px-2 py-1 text-xs text-white font-medium"
              style={{ backgroundColor: "#dd5851" }}
            >
              판매 대기 중
            </div>
          </>
        )}
      </div>
      <div className="p-3">
        <div className="text-xs text-gray-500">{card.brand}</div>
        <h3 className="line-clamp-2 text-sm font-medium">{card.title}</h3>
        {card.redeemedAt !== 0n && (
          <div className="mt-2 text-xs text-gray-500">
            <div>
              사용일:
              {new Date(Number(card.redeemedAt) * 1000).toLocaleString()}
            </div>
          </div>
        )}
      </div>
      {!card.redeemed && !card.isPending && !card.isSelling && (
        <div className="grid grid-cols-2 gap-2 p-3 pt-0">
          <button
            className="rounded border border-primary px-3 py-2 text-sm font-medium text-primary hover:bg-primary hover:text-white transition-colors"
            onClick={() => setIsQrScannerOpen(true)}
          >
            사용하기
          </button>

          <button
            className="rounded border border-gray-600 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-700 hover:text-white transition-colors"
            onClick={() => handleGift(Number(card.tokenId))}
          >
            선물하기
          </button>
        </div>
      )}

      {isQrScannerOpen && (
        <QrScanner
          onClose={() => setIsQrScannerOpen(false)}
          onScanSuccess={onScanSuccessHandler}
        />
      )}
    </div>
  );
}
