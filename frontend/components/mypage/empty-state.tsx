import Image from "next/image"

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh]">
      <div className="relative w-32 h-32 border-2 border-black rounded-full flex items-center justify-center">
        <Image
          src="/1.svg"
          alt="로그인 필요"
          width={120}
          height={120}
          className="rounded-full object-cover"
          unoptimized
        />
      </div>
      <p className="mt-4 text-lg font-semibold">로그인을 진행해주세요!</p>
    </div>
  )
}