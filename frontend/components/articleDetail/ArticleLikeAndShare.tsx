// components/article/ArticleLikeAndShare.tsx

import { Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type ArticleLikeAndShareProps = {
  isLiked: boolean;
  onLikeToggle: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onShare: () => void;
};

export function ArticleLikeAndShare({
  isLiked,
  onLikeToggle,
  onShare,
}: ArticleLikeAndShareProps) {
  return (
    <>
      <div className="col-span-1">
        <Button
          onClick={onLikeToggle}
          variant="outline"
          size="icon"
          className="h-12 w-full"
          aria-label={isLiked ? "찜 해제하기" : "찜하기"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={cn(
              "h-4 w-4",
              isLiked ? "fill-red-500 text-red-500" : "text-gray-500"
            )}
            fill={isLiked ? "currentColor" : "none"}
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </Button>
      </div>

      <div className="col-span-1">
        <Button
          onClick={onShare}
          variant="outline"
          size="icon"
          className="h-12 w-full"
          aria-label="공유하기"
        >
          <Share2 className="h-5 w-5" />
        </Button>
      </div>
    </>
  );
}
