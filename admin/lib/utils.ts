import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// utils/pinata.ts

export const uploadImageToPinata = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
    method: "POST",
    headers: {
      Authorization: process.env.NEXT_PUBLIC_PINATA_JWT as string,
    },
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.text();
    throw new Error("📦 이미지 업로드 실패: " + errorData);
  }

  const data = await res.json();
  return data.IpfsHash; // 이미지의 CID
};

export const uploadMetadataToPinata = async (
  metadata: object
): Promise<string> => {
  const res = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
    method: "POST",
    headers: {
      Authorization: process.env.NEXT_PUBLIC_PINATA_JWT as string,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(metadata),
  });

  if (!res.ok) {
    const errorData = await res.text();
    throw new Error("🧾 메타데이터 업로드 실패: " + errorData);
  }

  const data = await res.json();
  return data.IpfsHash; // metadata.json의 CID
};
