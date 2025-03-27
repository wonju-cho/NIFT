"use client";

import Link from "next/link";
import { TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArticleCard, ArticleCardProps } from "@/components/article/article-card";

interface WishListProps {
  likedArticles: ArticleCardProps[];
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  startPage: number;
  endPage: number;
  totalPage: number;
}

export const WishList = ({
  likedArticles,
  currentPage,
  setCurrentPage,
  startPage,
  endPage,
  totalPage,
}: WishListProps) => {
  return (
    <TabsContent value="favorites" className="mt-6">
      <div>
        <h2 className="mb-4 text-xl font-semibold">찜한 상품</h2>
        <p className="mb-6 text-sm text-muted-foreground">
          관심 있는 기프티콘을 모아볼 수 있습니다.
        </p>
      </div>

      {/* 찜한 상품 목록 표시 */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {likedArticles?.length > 0 ? (
          likedArticles.map((article) => (
            <Link
              key={article.articleId}
              href={`/product/${article.articleId}`}
              passHref
            >
              <ArticleCard {...article} />
            </Link>
          ))
        ) : (
          <p className="text-center text-gray-500">찜한 상품이 없습니다.</p>
        )}
      </div>

      {/* 페이지네이션 */}
      <div className="mt-8 flex justify-center items-center gap-2">
        <Button
          variant="ghost"
          disabled={currentPage === 0}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
        >
          ‹ 이전
        </Button>

        {Array.from({ length: endPage - startPage }, (_, i) => startPage + i).map((pageNum) => (
          <Button
            key={pageNum}
            variant={currentPage === pageNum ? "default" : "ghost"}
            onClick={() => setCurrentPage(pageNum)}
          >
            {pageNum + 1}
          </Button>
        ))}

        <Button
          variant="ghost"
          disabled={currentPage === totalPage - 1}
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPage - 1))}
        >
          다음 ›
        </Button>
      </div>
    </TabsContent>
  );
};
