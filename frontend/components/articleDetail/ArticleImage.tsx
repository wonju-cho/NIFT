// components/article/ArticleImage.tsx

import Image from "next/image";

type ArticleImageProps = {
  imageUrl: string;
  title: string;
};

export function ArticleImage({ imageUrl, title }: ArticleImageProps) {
  return (
    <div className="relative aspect-square overflow-hidden rounded-lg bg-white shadow-sm">
      <Image
        src={imageUrl || "/placeholder.svg"}
        alt={title}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 50vw"
        priority
      />
    </div>
  );
}
