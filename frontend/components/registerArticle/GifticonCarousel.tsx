"use client";
import Image from "next/image";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function GifticonCarousel({
  gifticons,
  selected,
  onSelect,
  scrollRef,
  onScroll,
}: {
  gifticons: any[];
  selected: string | null;
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
            key={gifticon.serialNum}
            className={`cursor-pointer rounded-lg border p-4 w-[200px] flex-shrink-0 transition-all ${
              selected === gifticon.serialNum
                ? "border-primary bg-primary/5"
                : ""
            }`}
            onClick={() => onSelect(gifticon.serialNum)}
          >
            <div className="relative">
              <Image
                src={gifticon.image}
                alt={gifticon.title}
                width={200}
                height={200}
                className="object-cover rounded-md"
              />
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
