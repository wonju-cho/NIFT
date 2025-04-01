import { ethers } from "ethers";
import GifticonNFT from "./contracts/GifticonNFT.json";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export const mintNFT = async ({
  userAddress, // userAddress를 파라미터로 추가
  gifticonId,
  quantity,
  price,
  name,
  description,
  metadataURI,
}: {
  userAddress: string; // userAddress 타입 정의
  gifticonId: number;
  quantity: number;
  price: number;
  name: string;
  description: string;
  metadataURI: string;
}) => {
  if (!window.ethereum) {
    console.error("지갑이 연결되어 있지 않습니다.");
    throw new Error("No wallet");
  }

  console.log("📡 지갑 연결 시도 중...");
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  console.log("✅ 서명자 주소:", await signer.getAddress());

  // 민팅 파라미터에 userAddress를 추가
  console.log("🎯 민팅 파라미터 확인:", {
    userAddress,
    gifticonId,
    quantity,
    price,
    name,
    description,
    metadataURI,
  });

  const contract = new ethers.Contract(
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
    GifticonNFT.abi,
    signer
  );

  try {
    console.log("🛠️ 민팅 트랜잭션 실행 중...");
    // mintBatchWithSerials 호출 시 userAddress 사용
    const tx = await contract.mintBatchWithSerials(
      userAddress, // userAddress를 파라미터로 전달
      gifticonId,
      quantity,
      price,
      name,
      description,
      metadataURI
    );

    console.log("⏳ 트랜잭션 채굴 대기 중...", tx.hash);
    await tx.wait();
    console.log("🎉 민팅 성공! 트랜잭션 해시:", tx.hash);

    return tx.hash;
  } catch (err) {
    console.error("❌ 민팅 실패:", err);
    throw err;
  }
};
