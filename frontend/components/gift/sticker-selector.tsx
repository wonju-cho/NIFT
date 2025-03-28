"use client"

interface StickerSelectorProps {
  isFlipped: boolean
  stickers: { id: string; src: string }[]
  onAddSticker: (sticker: { id: string; src: string }) => void
}

export function StickerSelector({ isFlipped, stickers, onAddSticker }: StickerSelectorProps) {
  return (
    <div className="flex flex-col space-y-4">
      <h3 className="font-medium">{isFlipped ? "뒷면 스티커 추가" : "앞면 스티커 추가"}</h3>

      {/* 스티커 카테고리 필터 */}
      <div className="flex flex-wrap gap-2 pb-2">
        <button className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary hover:bg-primary/20">전체</button>
        <button className="text-xs px-2 py-1 rounded-full bg-gray-100 hover:bg-gray-200">생일</button>
        <button className="text-xs px-2 py-1 rounded-full bg-gray-100 hover:bg-gray-200">축하</button>
        <button className="text-xs px-2 py-1 rounded-full bg-gray-100 hover:bg-gray-200">사랑</button>
        <button className="text-xs px-2 py-1 rounded-full bg-gray-100 hover:bg-gray-200">장식</button>
        <button className="text-xs px-2 py-1 rounded-full bg-gray-100 hover:bg-gray-200">음식</button>
        <button className="text-xs px-2 py-1 rounded-full bg-gray-100 hover:bg-gray-200">이모티콘</button>
      </div>

      {/* 스티커 그리드 */}
      <div className="grid grid-cols-3 gap-2">
        {stickers.map((sticker) => (
          <div
            key={sticker.id}
            className="cursor-pointer rounded-md overflow-hidden border hover:border-primary p-2 transition-all hover:shadow-sm"
            onClick={() => onAddSticker(sticker)}
          >
            <div className="aspect-square relative flex items-center justify-center bg-white">
              <div className="text-2xl">
                {sticker.src.includes("text=") ? sticker.src.split("text=")[1].replace(/%20/g, " ") : "🔍"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

