import { GiftCard } from "@/components/gift/gift-card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { UserNFT } from "@/lib/api/web3";

interface GiftTabProps {
  availableGiftCards: any[];
  usedGiftCards: any[];
  ITEMS_PER_PAGE: number;
  availableCurrentPage: number;
  setAvailableCurrentPage: (page: number) => void;
  usedCurrentPage: number;
  setUsedCurrentPage: (page: number) => void;
  calculateDday: (expiry: string) => number;
  giftCardTab: string;
  setGiftCardTab: (tab: string) => void;
  onGifticonUsed: (serialNum: number) => void;
}

export function GiftTab({
  availableGiftCards,
  usedGiftCards,
  ITEMS_PER_PAGE,
  availableCurrentPage,
  setAvailableCurrentPage,
  usedCurrentPage,
  setUsedCurrentPage,
  calculateDday,
  giftCardTab,
  setGiftCardTab,
  onGifticonUsed,
}: GiftTabProps) {
  const availableTotalPage =
    Math.ceil(availableGiftCards.length / ITEMS_PER_PAGE) || 1;
  const usedTotalPage = Math.ceil(usedGiftCards.length / ITEMS_PER_PAGE) || 1;

  return (
    <Tabs value={giftCardTab} onValueChange={setGiftCardTab}>
      <TabsList className="w-full">
        <TabsTrigger value="available" className="flex-1">
          사용 가능 {availableGiftCards.length}
        </TabsTrigger>
        <TabsTrigger value="used" className="flex-1">
          사용 완료 {usedGiftCards.length}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="available" className="mt-6">
        {/* Changed grid-cols-1 to grid-cols-2 for better mobile layout */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
          {availableGiftCards
            .slice(
              availableCurrentPage * ITEMS_PER_PAGE,
              (availableCurrentPage + 1) * ITEMS_PER_PAGE
            )
            .map((card: UserNFT) => (
              <GiftCard
                key={Number(card.serialNum)}
                expiryDays={`D-${calculateDday(card.expiryDate)}`}
                card={card}
                onGifticonUsed={onGifticonUsed}
              />
            ))}
        </div>

        {availableGiftCards.length === 0 ? (
          <div className="mt-8 mb-12 text-center text-muted-foreground">
            사용 가능한 선물이 없습니다.
          </div>
        ) : (
          <Pagination
            currentPage={availableCurrentPage}
            totalPage={availableTotalPage}
            setCurrentPage={setAvailableCurrentPage}
          />
        )}
      </TabsContent>

      <TabsContent value="used" className="mt-6">
        {/* Changed grid-cols-1 to grid-cols-2 for better mobile layout */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
          {usedGiftCards
            .slice(
              usedCurrentPage * ITEMS_PER_PAGE,
              (usedCurrentPage + 1) * ITEMS_PER_PAGE
            )
            .map((card: UserNFT) => (
              <GiftCard
                key={Number(card.serialNum)}
                expiryDays={`D-${calculateDday(card.expiryDate)}`}
                card={card}
              />
            ))}
        </div>

        {usedGiftCards.length === 0 ? (
          <div className="mt-8 mb-12 text-center text-muted-foreground">
            사용 완료된 선물이 없습니다.
          </div>
        ) : (
          <Pagination
            currentPage={usedCurrentPage}
            totalPage={usedTotalPage}
            setCurrentPage={setUsedCurrentPage}
          />
        )}
      </TabsContent>
    </Tabs>
  );
}

// 내부용 Pagination 컴포넌트
function Pagination({
  currentPage,
  totalPage,
  setCurrentPage,
}: {
  currentPage: number;
  totalPage: number;
  setCurrentPage: (page: number) => void;
}) {
  const maxButtons = 5;
  const start = Math.floor(currentPage / maxButtons) * maxButtons;
  const end = Math.min(start + maxButtons, totalPage);

  return (
    <div className="mt-8 flex justify-center items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        disabled={currentPage === 0}
        onClick={() => setCurrentPage(Math.max(currentPage - 1, 0))}
      >
        ‹ 이전
      </Button>

      {Array.from({ length: end - start }, (_, i) => i + start).map(
        (pageNum) => (
          <Button
            key={pageNum}
            variant={currentPage === pageNum ? "default" : "ghost"}
            size="sm"
            onClick={() => setCurrentPage(pageNum)}
          >
            {pageNum + 1}
          </Button>
        )
      )}

      <Button
        variant="ghost"
        size="sm"
        disabled={currentPage === totalPage - 1}
        onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPage - 1))}
      >
        다음 ›
      </Button>
    </div>
  );
}
