import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

interface GiftProductInfoProps {
  article: any
}

export function GiftProductInfo({ article }: GiftProductInfoProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-bold mb-4">선물할 상품</h2>
        <div className="flex gap-4">
          <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border bg-gray-100">
            <Image
              src={article.image || "/placeholder.svg"}
              alt={article.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 space-y-1.5">
            <h3 className="font-medium">{article.brandName}</h3>
            <p className="text-lg font-bold leading-tight">{article.title}</p>
            <p className="mt-2 text-sm text-gray-500 leading-relaxed">{article.description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
