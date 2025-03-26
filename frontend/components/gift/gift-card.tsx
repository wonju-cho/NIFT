import Image from "next/image"

interface GiftCardProps {
  title: string
  brand: string
  price: number
  sender: string
  date: string
  expiryDays?: string
  imageUrl: string
  usedDate?: string | null
}

export function GiftCard({ title, brand, price, sender, date, expiryDays, imageUrl, usedDate = null }: GiftCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-lg border bg-white transition-all hover:shadow-md">
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {expiryDays && (
          <div className="absolute left-2 top-2 rounded bg-gray-700 px-2 py-1 text-xs text-white">{expiryDays}</div>
        )}
        {usedDate && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="rounded-full border-4 border-white p-3 text-xl font-bold text-white">사용완료</div>
          </div>
        )}
      </div>
      <div className="p-3">
        <div className="text-xs text-gray-500">{brand}</div>
        <h3 className="line-clamp-2 text-sm font-medium">{title}</h3>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-base font-bold">{price.toLocaleString()}원</span>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          <div>from. {sender}</div>
          <div>{usedDate ? `사용일: ${usedDate}` : `받은날: ${date}`}</div>
        </div>
      </div>
    </div>
  )
}

