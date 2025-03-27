// components/product/ProductImage.tsx
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

export function ArticleImage({
  src,
  title,
  isNew,
}: {
  src: string;
  title: string;
  isNew: boolean;
}) {
  return (
    <div className="relative aspect-square overflow-hidden rounded-lg bg-white shadow-sm">
      <Image
        src={src}
        alt={title}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 50vw"
        priority
      />
      {isNew && (
        <Badge className="absolute left-4 top-4 bg-blue-500 hover:bg-blue-600">
          NEW
        </Badge>
      )}
    </div>
  );
}
