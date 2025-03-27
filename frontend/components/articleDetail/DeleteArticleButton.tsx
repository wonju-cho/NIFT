// components/article/DeleteArticleButton.tsx

"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

type Props = {
  articleId: number;
  articleUserId: number;
};

export function DeleteArticleButton({ articleId, articleUserId }: Props) {
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

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
      const userId = parseInt(decoded.sub, 10);
      setCurrentUserId(userId);
    }
  }, []);

  // 삭제 요청
  const handleDelete = async () => {
    const confirmDelete = confirm("정말로 이 게시글을 삭제하시겠습니까?");
    if (!confirmDelete) return;

    const token = localStorage.getItem("access_token");
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/secondhand-articles/${articleId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.ok) {
      alert("삭제가 완료되었습니다.");
      window.location.href = "/articles";
    } else {
      alert("삭제에 실패했습니다.");
    }
  };

  // 조건: 내가 작성한 글일 때만 보이게
  if (currentUserId !== articleUserId) return null;

  return (
    <Button
      variant="outline"
      className="h-12 w-full border border-primary text-primary bg-white hover:bg-primary/10 flex items-center justify-center gap-2"
      onClick={handleDelete}
    >
      <Trash2 className="w-4 h-4" />
      삭제하기
    </Button>
  );
}
