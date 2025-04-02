"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { cancelSale, isSellingNFT } from "@/lib/api/web3";
import { useLoading } from "@/components/LoadingContext";
import { apiClient } from "@/lib/api/CustomAxios";

type Props = {
  articleId: number;
  articleUserId: number;
  serialNum: number;
};

export function DeleteArticleButton({
  articleId,
  articleUserId,
  serialNum,
}: Props) {
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const { setIsLoading } = useLoading();
  const [isProcessing, setIsProcessing] = useState(false);
  // txHash가 이미 전송되었는지 여부를 추적하는 상태 변수
  const [txHashSent, setTxHashSent] = useState(false);

  // JWT 디코딩 함수
  const decodeJWT = (token: string): { sub: string } | null => {
    try {
      const payload = token.split(".")[1];
      return JSON.parse(atob(payload));
    } catch (e) {
      console.error("JWT 디코딩 실패", e);
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    const decoded = decodeJWT(token);
    if (decoded?.sub) {
      setCurrentUserId(parseInt(decoded.sub, 10));
    }
  }, []);

  const handleDelete = async () => {
    if (isProcessing) return;
    console.log("✅ 시작");

    const confirmDelete = confirm("정말로 이 게시글을 삭제하시겠습니까?");
    if (!confirmDelete) {
      console.log("❌ 유저가 취소함");
      return;
    }

    const token = localStorage.getItem("access_token");
    if (!token) {
      console.log("❌ 토큰 없음");
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      setIsProcessing(true);
      setIsLoading(true);
      console.log("⏳ 삭제 처리 시작");

      const isSelling = await isSellingNFT(serialNum);
      console.log("🔍 isSelling:", isSelling);

      if (isSelling) {
        const didCancel = await cancelSale(serialNum);
        console.log("🚫 cancelSale 결과:", didCancel);

        if (!didCancel.success) {
          alert(
            "❌ 판매 상태 취소에 실패했습니다.\n게시글을 삭제할 수 없습니다."
          );
          return;
        }

        const data = { txHash: String(didCancel.txHash) };
        console.log("📦 DELETE 요청 데이터:", data);

        const response = await apiClient.delete(
          `/secondhand-articles/${articleId}`,
          { data }
        );
        console.log("✅ 삭제 API 응답:", response);

        if (response.status === 201) {
          alert("삭제가 완료되었습니다.");
          setTxHashSent(true);
          window.location.href = "/articles";
        } else {
          alert("❌ 게시글 삭제에 실패했습니다.");
        }
      }
    } catch (error: any) {
      console.error("❌ 삭제 처리 중 오류:", error.response || error);
      alert("오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
      setIsProcessing(false);
    }
  };

  if (currentUserId !== articleUserId) return null;

  return (
    <Button
      variant="outline"
      disabled={isProcessing}
      className="h-12 w-full border border-primary text-primary bg-white hover:bg-primary/10 flex items-center justify-center gap-2"
      onClick={handleDelete}
    >
      <Trash2 className="w-4 h-4" />
      삭제하기
    </Button>
  );
}
