// ArticlePriceCard.tsx

type ArticlePriceCardProps = {
  currentPrice?: number; // Optional
  originalPrice?: number; // Optional
  discountRate?: number;
};

export function ArticlePriceCard({
  currentPrice,
  originalPrice,
  discountRate,
}: ArticlePriceCardProps) {
  // 값이 숫자이고 0 이상인지 검사
  const validCurrentPrice =
    typeof currentPrice === "number" && !isNaN(currentPrice) && currentPrice > 0
      ? currentPrice
      : undefined;

  const validOriginalPrice =
    typeof originalPrice === "number" &&
    !isNaN(originalPrice) &&
    originalPrice > 0
      ? originalPrice
      : undefined;

  // 두 가격 모두 유효하지 않으면 "가격 정보 없음" 표시
  if (!validCurrentPrice && !validOriginalPrice) {
    return (
      <span className="text-base font-bold text-gray-500">가격 정보 없음</span>
    );
  }

  // 유효한 가격 중 하나만 있거나 둘 다 있으면 기존 로직 수행
  const isDiscounted =
    validOriginalPrice && validCurrentPrice
      ? validOriginalPrice > validCurrentPrice
      : false;

  // 할인율 계산
  const calculatedDiscountPercent = isDiscounted
    ? Math.round((1 - validCurrentPrice! / validOriginalPrice!) * 100)
    : 0;

  // 표시할 할인율 (props로 받은 값 우선, 없으면 계산된 값)
  const displayDiscountRate =
    discountRate !== undefined ? discountRate : calculatedDiscountPercent;

  return (
    <div className="flex items-baseline gap-1">
      {displayDiscountRate > 0 && (
        <span className="text-sm text-red-500">~{displayDiscountRate}%</span>
      )}

      {/* 현재가 표시 */}
      {validCurrentPrice ? (
        <span className="text-base font-bold">
          {validCurrentPrice.toLocaleString()}
        </span>
      ) : validOriginalPrice ? (
        // If no current price, but original price exists, show original price
        <span className="text-base font-bold">
          {validOriginalPrice.toLocaleString()}
        </span>
      ) : (
        // If neither price is valid, show placeholder (already handled above, but safe fallback)
        <span className="text-base font-bold text-gray-500">
          가격 정보 없음
        </span>
      )}

      {/* 원가가 있고, 할인 중일 때만 strike-through 표시 */}
      {isDiscounted && validOriginalPrice && (
        <span className="text-xs text-gray-500 line-through">
          {validOriginalPrice.toLocaleString()}
        </span>
      )}
    </div>
  );
}
