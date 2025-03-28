import Image from "next/image"
import { useRouter } from "next/navigation"
import { getTokenIdBySerial } from "@/lib/api/web3"

interface GiftCardProps {
  title: string
  brand: string
  expiryDays?: string
  imageUrl: string
  usedDate?: string | null
  serialNum: number
}

export function GiftCard({ title, brand, expiryDays, imageUrl, usedDate = null, serialNum }: GiftCardProps & {serialNum: number}) {
  const router = useRouter()

  const handleGift = async (serialNum: number) => {
    try {
      const tokenId = await getTokenIdBySerial(serialNum)
      router.push(`/gift/${tokenId}/customize?type=gifticon`)
    } catch (error) {
      console.error("gifticonId 조회 실패:", error)
      alert("기프티콘 정보를 가져오지 못했습니다.")
    }
  }
  
  
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
          <>
            <div className="absolute inset-0 bg-black/30"></div>
            <div
              className="absolute left-2 top-2 rounded px-2 py-1 text-xs text-white font-medium"
              style={{ backgroundColor: "#dd5851" }}
            >
              사용 완료
            </div>
          </>
        )}
      </div>
      <div className="p-3">
        <div className="text-xs text-gray-500">{brand}</div>
        <h3 className="line-clamp-2 text-sm font-medium">{title}</h3>
        {usedDate && (
          <div className="mt-2 text-xs text-gray-500">
            <div>사용일: {usedDate}</div>
          </div>
        )}
      </div>
      {!usedDate && (
        <div className="grid grid-cols-2 gap-2 p-3 pt-0">
          <button className="rounded border border-primary px-3 py-2 text-sm font-medium text-primary hover:bg-primary hover:text-white transition-colors">
            사용하기
          </button>
          <button 
            className="rounded border border-gray-600 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-700 hover:text-white transition-colors"
            onClick={() => handleGift(serialNum)}
          >
            선물하기
          </button>
        </div>
      )}
    </div>
  )
}

