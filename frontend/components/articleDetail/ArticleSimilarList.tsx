// components/article/ArticleSimilarList.tsx

import { PopularArticles } from "@/components/home/popular-articles";

export function ArticleSimilarList() {
  return (
    <div className="mt-16">
      <h2 className="mb-8 text-2xl font-bold">비슷한 상품</h2>
      <PopularArticles />
    </div>
  );
}
