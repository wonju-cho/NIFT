import { GifticonDetailCard } from "./SelectedGifticon";
import { RegisterForm } from "./RegisterForm";
import { GifticonCarousel } from "./GifticonCarousel";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile"; // Import useIsMobile

export function RegisterPageLayout({
  gifticons,
  selected,
  onSelect,
  selectedData,
  onSubmit,
  carouselRef,
  onScroll,
}: any) {
  const isMobile = useIsMobile();

  return (
    <div className="container">
      {/* Flex container for mobile reordering */}
      <div
        className={`md:grid md:grid-cols-2 md:gap-8 items-stretch flex flex-col ${
          isMobile ? "mb-8" : ""
        }`}
      >
        {/* 선택한 기프티콘 영역 */}
        <div className={`h-[500px] ${isMobile ? "order-1" : ""}`}>
          <h2 className="text-xl font-bold mb-4">선택한 기프티콘</h2>
          <GifticonDetailCard gifticon={selectedData} />
        </div>

        {/* 게시글 작성 영역 */}
        <div className={`h-[500px] ${isMobile ? "order-3" : ""}`}>
          <h2 className="text-xl font-bold mb-4">게시글 작성</h2>
          <RegisterForm onSubmit={onSubmit} />
        </div>
      </div>

      <Separator className="my-8" />

      <div className={`${isMobile ? "order-2" : ""}`}>
        <GifticonCarousel
          gifticons={gifticons}
          selected={selected}
          onSelect={onSelect}
          scrollRef={carouselRef}
          onScroll={onScroll}
        />
      </div>
    </div>
  );
}
