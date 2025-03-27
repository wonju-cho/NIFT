"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface SaleHistoryItem {
  articleId: number;
  title: string;
  imageUrl: string;
  currentPrice: number;
  buyerNickName: string | null;
  saleDate: string | null;
}

export const SaleHistory = () => {
  const [histories, setHistories] = useState<SaleHistoryItem[]>([]);
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
      `${BASE_URL}/secondhand-articles/histories/sale?page=${page}&size=5&sort=createdAt,desc`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) throw new Error("판매 내역 불러오기 실패");

    const data = await res.json();
    const newItems = data.histories.map((item: SaleHistoryItem) => ({
      ...item,
      saleDate: item.saleDate
        ? new Date(item.saleDate).toLocaleDateString("ko-KR")
        : null,
    }));

    const existingIds = new Set(histories.map((h) => h.articleId));
    const filtered = newItems.filter(
        (item: SaleHistoryItem) => !existingIds.has(item.articleId)
    );

    // 중복 제거 articleId 기준
    setHistories((prev) => {
      const existingIds = new Set(prev.map((item) => item.articleId));
      const uniqueItems = newItems.filter(
      (item: SaleHistoryItem) => !existingIds.has(item.articleId)
      );

      return [...prev, ...uniqueItems];
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
    <div className="space-y-4 max-h-[500px] overflow-y-auto">
      {histories.length > 0 ? (
        histories.map((item) => (
          <div
            key={item.articleId}
            className="flex items-center gap-4 rounded-lg border bg-white p-4"
          >
            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
              <Image
                src={item.imageUrl || "/placeholder.svg"}
                alt={item.title}
                fill
                priority
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-medium">{item.title}</h3>
              <div className="mt-1 text-sm text-gray-500">
                <div>
                  구매자: {item.buyerNickName ?? "-"}
                </div>
                <div>
                  판매일: {item.saleDate ?? "-"}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold">
                {item.currentPrice.toLocaleString()}원
              </div>
              <div className="mt-1 text-sm text-primary">
                {item.buyerNickName ? "완료" : "판매전"}
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-4 text-gray-500">판매 내역이 없습니다.</div>
      )}
      <div ref={loaderRef} />
    </div>
  );
};
