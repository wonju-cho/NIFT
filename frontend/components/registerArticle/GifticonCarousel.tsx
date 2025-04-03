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
      <div ref={scrollRef} className="flex overflow-x-auto gap-4 pb-4">
        {gifticons.map((gifticon) => (
          <div
            key={Number(gifticon.serialNum)}
            className={`cursor-pointer rounded-lg border p-4 w-[200px] flex-shrink-0 transition-all
              ${
                selected === gifticon.serialNum
                  ? "border-primary bg-primary/5"
                  : ""
              }
              ${
                gifticon.isSelling || gifticon.isPending
                  ? "opacity-40 pointer-events-none"
                  : "hover:border-gray-400"
              }
            `}
            onClick={() => {
              if (gifticon.isSelling) return; // 판매중이면 클릭 막기
              onSelect(String(gifticon.serialNum));
            }}
          >
            <div className="relative">
              <Image
                src={gifticon.image}
                alt={gifticon.title}
                width={200}
                height={200}
                className="object-cover rounded-md"
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
            <div className="mt-2">
              <h3 className="text-sm font-medium">{gifticon.title}</h3>
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
