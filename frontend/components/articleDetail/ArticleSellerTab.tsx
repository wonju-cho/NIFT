// components/article/ArticleSellerTab.tsx

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type ArticleSellerTabProps = {
  userNickName: string;
  profileImage: string;
  sellerTxs: number;
};

export function ArticleSellerTab({
  userNickName,
  profileImage,
  sellerTxs
}: ArticleSellerTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={profileImage} alt={userNickName} />
          <AvatarFallback>{userNickName}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-lg font-medium">{userNickName}</h3>
          <p className="text-sm text-muted-foreground">거래 {sellerTxs}회</p>
        </div>
      </div>

      <div>
        <h4 className="font-medium">판매자의 다른 상품</h4>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {/* TODO: 판매자의 다른 상품 리스트 구현 */}
        </div>
      </div>
    </div>
  );
}
