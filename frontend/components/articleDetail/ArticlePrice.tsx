// components/article/ArticlePrice.tsx

type ArticlePriceProps = {
  currentPrice: number;
  originalPrice: number;
};

export function ArticlePrice({
  currentPrice,
  originalPrice,
}: ArticlePriceProps) {
  const isDiscounted = originalPrice > currentPrice;
  const discountPercent = isDiscounted
    ? Math.round((1 - currentPrice / originalPrice) * 100)
    : 0;

  return (
    <div className="mb-6">
      <span className="text-3xl font-bold">
        {currentPrice.toLocaleString()}원
      </span>

      {isDiscounted && (
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-sm line-through text-muted-foreground">
            {originalPrice.toLocaleString()}원
          </span>
          <span className="text-sm text-primary">{discountPercent}% 할인</span>
        </div>
      )}
    </div>
  );
}
