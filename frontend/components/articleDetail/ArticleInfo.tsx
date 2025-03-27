// components/product/ProductInfo.tsx
import { MapPin, Clock } from "lucide-react";

export function ArticleInfo({
  category,
  title,
  price,
  originalPrice,
  location,
  distance,
  listedAt,
  views,
}: any) {
  return (
    <>
      <div className="mb-2 text-sm text-muted-foreground">{category}</div>
      <h1 className="mb-4 text-2xl font-bold md:text-3xl">{title}</h1>

      <div className="mb-6">
        <span className="text-3xl font-bold">{price.toLocaleString()}원</span>
        {originalPrice > price && (
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-sm line-through text-muted-foreground">
              {originalPrice.toLocaleString()}원
            </span>
            <span className="text-sm text-primary">
              {Math.round((1 - price / originalPrice) * 100)}% 할인
            </span>
          </div>
        )}
      </div>

      <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
        <MapPin className="h-4 w-4" />
        <span>
          {location} {distance && `· ${distance}`}
        </span>
      </div>

      <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
        <Clock className="h-4 w-4" />
        <span>
          등록일: {listedAt} · 조회 {views}회
        </span>
      </div>
    </>
  );
}
