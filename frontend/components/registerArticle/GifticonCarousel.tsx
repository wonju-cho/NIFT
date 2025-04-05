"use client";
import Image from "next/image";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { UserNFT } from "@/lib/api/web3";

export function GifticonCarousel({
  gifticons,
  selected,
  onSelect,
  scrollRef,
  onScroll,
}: {
  gifticons: UserNFT[];
  selected: BigInt | null;
  onSelect: (serialNum: string) => void;
  scrollRef: React.RefObject<HTMLDivElement>;
  onScroll: (dir: "left" | "right") => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">보유중인 기프티콘</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onScroll("left")}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onScroll("right")}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div ref={scrollRef} className="flex overflow-x-auto gap-4 pb-4 overflow-y-visible">
        {gifticons.map((gifticon) => (
          <div
            key={Number(gifticon.serialNum)}
            className={`group relative z-10 cursor-pointer rounded-lg border w-[200px] h-[300px] flex flex-col justify-between p-4 flex-shrink-0 transition-all
              ${selected === gifticon.serialNum ? "border-primary bg-primary/5" : ""}
              ${
                gifticon.isSelling || gifticon.isPending
                  ? "opacity-40 pointer-events-none"
                  : "hover:border-gray-400 hover:shadow-md"
              }
            `}
            onClick={() => {
              if (gifticon.isSelling) return;
              onSelect(String(gifticon.serialNum));
            }}
          >
            {/* 이미지 + 상태 */}
            <div className="relative h-[200px]">
              <Image
                src={gifticon.image}
                alt={gifticon.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover rounded-md transition-transform group-hover:scale-105"
                priority
              />
              {gifticon.isSelling && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="px-3 py-1 rounded-full bg-red-500 text-white text-xs font-semibold uppercase tracking-wide shadow-lg z-10">
                    판매 등록 중
                  </div>
                </div>
              )}
              {gifticon.isPending && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="px-3 py-1 rounded-full bg-red-500 text-white text-xs font-semibold uppercase tracking-wide shadow-lg z-10">
                    선물 대기 중
                  </div>
                </div>
              )}
              {selected === gifticon.serialNum && (
                <div className="absolute right-2 top-2 rounded-full bg-primary text-white h-6 w-6 flex items-center justify-center">
                  <Check className="h-4 w-4" />
                </div>
              )}
            </div>

            {/* 텍스트 정보 (항상 아래쪽에 고정) */}
            <div className="mt-2">
              <h3 className="text-sm font-medium truncate">{gifticon.title}</h3>
              <p className="text-xs text-muted-foreground">
                유효기간: {gifticon.expiryDate}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
