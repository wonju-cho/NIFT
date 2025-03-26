import Image from "next/image";

export function GifticonDetailCard({ gifticon }: { gifticon: any }) {
  if (!gifticon)
    return (
      <p className="text-muted-foreground text-center">기프티콘을 선택하세요</p>
    );

  return (
    <div className="flex flex-col items-center p-4">
      <Image
        src={gifticon.image}
        alt="선택된 기프티콘"
        width={250}
        height={250}
        className="object-contain mb-4"
      />
      <div className="bg-white rounded-lg p-4 max-w-md">
        <h3 className="text-lg font-medium mb-2">{gifticon.title}</h3>
        <div className="space-y-1 text-left text-sm">
          <div>브랜드: {gifticon.brand}</div>
          <div>카테고리: {gifticon.category}</div>
          <div>유효기간: {gifticon.expiryDate}</div>
          <div>시리얼번호: {gifticon.serialNum + ""}</div>
        </div>
      </div>
    </div>
  );
}
