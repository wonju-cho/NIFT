import { ArticleCard } from "@/components/article/article-card"

interface ArticleListDto {
  articleId: number
  categoryId: number
  categoryName: string
  brandName: string
  title: string
  description: string
  currentPrice: number
  originalPrice: number
  discountRate: number
  imageUrl: string
  countLikes: number
  viewCnt: number
  createdAt: string
  isLiked: boolean
}

interface ArticleGridProps {
  articles: ArticleListDto[]
  className?: string
}

export function ArticleGrid({ articles, className }: ArticleGridProps) {
  return (
    <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 ${className}`}>
      {articles.map((article) => (
        <ArticleCard
          key={article.articleId}
          articleId={article.articleId}
          title={article.title}
          brandName={article.brandName}
          currentPrice={article.currentPrice}
          originalPrice={article.originalPrice}
          discountRate={article.discountRate}
          imageUrl={article.imageUrl}
          isLiked={article.isLiked}
        />
      ))}
    </div>
  )
}

