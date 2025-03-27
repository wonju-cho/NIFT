// components/product/ProductSellerCard.tsx
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export function ArticleSellerCard({ seller }: { seller: any }) {
  return (
    <div className="mb-6 rounded-lg bg-gray-50 p-4">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={seller.avatar} alt={seller.name} />
          <AvatarFallback>{seller.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium">{seller.name}</div>
          <div className="text-xs text-muted-foreground">
            거래 {seller.transactions}회 · 평점 {seller.rating}
          </div>
        </div>
      </div>
    </div>
  );
}
