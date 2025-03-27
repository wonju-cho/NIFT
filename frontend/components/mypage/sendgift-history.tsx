"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface SendGiftHistoryItem {
  giftHistoryId: number;
  gifticonTitle: string;
  imageUrl: string;
  toNickName: string;
  sendDate: string;
}

export const SendGiftHistory = () => {
  const [histories, setHistories] = useState<SendGiftHistoryItem[]>([]);
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(true);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const getAccessToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("access_token") || null;
    }
    return null;
  };

  const fetchHistories = async (page: number) => {
    const token = getAccessToken();
    if (!token) return;

    const res = await fetch(
      `${BASE_URL}/secondhand-articles/histories/send-gift?page=${page}&size=5&sort=createdAt,desc`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) throw new Error("보낸 선물 내역 불러오기 실패");

    const data = await res.json();
    const newItems = data.histories.map((item: any) => ({
      ...item,
      sendDate: new Date(item.sendDate).toLocaleDateString("ko-KR"),
    }));

    // 중복 제거 giftHistoryId 기준
    setHistories((prev) => {
        const existingIds = new Set(prev.map((item) => item.giftHistoryId));
        const uniqueItems = newItems.filter(
            (item: SendGiftHistoryItem) => !existingIds.has(item.giftHistoryId)
        );

        return [...prev, ...uniqueItems]
    });
    setHasNext(data.hasNext);
  };

  useEffect(() => {
    setPage(0);
  }, []);

  useEffect(() => {
    fetchHistories(page);
  }, [page]);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && hasNext) {
        setPage((prev) => prev + 1);
      }
    },
    [hasNext]
  );

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [handleObserver]);

  return (
    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
      {histories.length > 0 ? (
        histories.map((item) => (
          <div
            key={item.giftHistoryId}
            className="flex items-center gap-4 rounded-lg border bg-white p-4"
          >
            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
              <Image
                src={item.imageUrl || "/placeholder.svg"}
                alt={item.gifticonTitle}
                fill
                priority
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-medium">{item.gifticonTitle}</h3>
              <div className="mt-1 text-sm text-gray-500">
                <div>받는 사람: {item.toNickName}</div>
                <div>선물일: {item.sendDate}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="mt-1 text-sm text-primary">전송완료</div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-4 text-gray-500">보낸 선물이 없습니다.</div>
      )}
      <div ref={loaderRef} />
    </div>
  );
};
