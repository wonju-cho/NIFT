// components/product/ProductTabs.tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export function ArticleTabs({
  description,
  expiryDate,
}: {
  description: string;
  expiryDate: string;
}) {
  return (
    <Tabs defaultValue="description" className="w-full">
      <TabsList className="w-full justify-start border-b bg-transparent p-0">
        <TabsTrigger
          value="description"
          className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary"
        >
          상품 설명
        </TabsTrigger>
        <TabsTrigger
          value="seller"
          className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary"
        >
          판매자 정보
        </TabsTrigger>
        <TabsTrigger
          value="reviews"
          className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary"
        >
          거래 후기
        </TabsTrigger>
      </TabsList>

      <TabsContent
        value="description"
        className="mt-6 rounded-lg bg-white p-6 shadow-sm"
      >
        <div className="prose max-w-none">
          <p>{description}</p>
          <ul>
            <li>유효기간: {expiryDate}</li>
            <li>사용 가능 매장: 전국 스타벅스 매장</li>
            <li>교환 및 환불: 구매 후 7일 이내 가능</li>
          </ul>
        </div>
      </TabsContent>

      <TabsContent
        value="seller"
        className="mt-6 rounded-lg bg-white p-6 shadow-sm"
      >
        <div className="text-muted-foreground">
          판매자 정보는 준비 중입니다.
        </div>
      </TabsContent>

      <TabsContent
        value="reviews"
        className="mt-6 rounded-lg bg-white p-6 shadow-sm"
      >
        <div className="text-center py-12 text-muted-foreground">
          아직 거래 후기가 없습니다.
        </div>
      </TabsContent>
    </Tabs>
  );
}
