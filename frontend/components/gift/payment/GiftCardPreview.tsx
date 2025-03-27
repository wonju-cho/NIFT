import { Card, CardContent } from "@/components/ui/card"
import { CardPreview } from "@/components/gift/card-preview"

interface GiftCardPreviewProps {
  cardData: any
  id: string
}

export function GiftCardPreview({ cardData, id }: GiftCardPreviewProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">선물 카드 미리보기</h2>
          <a href={`/gift/${id}/customize?edit=true`} className="text-sm underline">
            카드 수정하기
          </a>
        </div>
        <CardPreview cardData={cardData} className="w-full max-w-[500px] mx-auto" />
      </CardContent>
    </Card>
  )
}
