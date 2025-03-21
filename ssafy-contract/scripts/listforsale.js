//TODO: 현재 버전에 맞게 수정 예정
require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
  const contractAddress = "0xEAc580119cad82b6ffB63A58269F1A66A97EB590";
  const sellerAddress = "0x4ED78E0a67c2F984D4985D490aAA5bC36340263F";

  // ✅ 외부에서 `serialNumber`와 `sellPrice` 받기
  const serialNumber = process.argv[2]; // 판매 등록할 NFT 시리얼 넘버
  const sellPrice = ethers.parseEther(process.argv[3]); // NFT 가격

  if (!serialNumber || !sellPrice) {
    throw new Error("❌ 올바른 serialNumber와 sellPrice 값을 입력하세요.");
  }

  console.log(`🚀 SSAFY 네트워크 연결 중 (Serial Number: ${serialNumber})`);
  const provider = new ethers.JsonRpcProvider(
    "https://rpc.ssafy-blockchain.com"
  );

  const privateKey = process.env.TEST_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error(
      "❌ PRIVATE_KEY가 설정되지 않았습니다. .env 파일을 확인하세요."
    );
  }

  const signer = new ethers.Wallet(privateKey, provider);

  if (signer.address.toLowerCase() !== sellerAddress.toLowerCase()) {
    throw new Error(
      `❌ PRIVATE_KEY가 ${sellerAddress} 주소와 일치하지 않습니다.`
    );
  }
  console.log(`🛠 서명자 주소 (판매자): ${sellerAddress}`);

  const gifticonNFTWithSigner = await ethers.getContractAt(
    "GifticonNFT",
    contractAddress,
    signer
  );

  const gifticonNFTWithoutSigner = await ethers.getContractAt(
    "GifticonNFT",
    contractAddress,
    provider // provider만 연결
  );

  console.log("🔍 NFT 상태 확인 중...");
  try {
    console.log("⏳ getTokenIdBySerialNumber 호출 전..."); // 추가된 로그
    // 시리얼 넘버로 토큰 ID를 조회합니다.
    const tokenId = await gifticonNFTWithSigner.getTokenIdBySerialNumber(
      serialNumber
    );
    console.log(`🔑 조회된 Token ID: ${tokenId}`); // 기존 로그

    // 수정된 부분: BigNumber 대신 BigInt 비교 사용
    if (tokenId == 0n) {
      throw new Error(
        `❌ 시리얼 넘버 '${serialNumber}'에 해당하는 NFT가 존재하지 않습니다.`
      );
    }

    const balance = await gifticonNFTWithoutSigner.balanceOf(
      sellerAddress,
      tokenId
    );
    console.log(`📌 판매자의 NFT(Token ID: ${tokenId}) 보유량: ${balance}`); // 기존 로그

    const price = await gifticonNFTWithSigner.getPrice(tokenId).catch(() => 0);
    console.log(`📌 기존 판매 가격: ${ethers.formatEther(price)} SSF`);

    const seller = await gifticonNFTWithSigner.getSeller(tokenId);
    console.log(`📌 현재 판매자 주소: ${seller}`);

    const redeemed = await gifticonNFTWithSigner
      .isRedeemed(tokenId)
      .catch(() => false);
    console.log(`📌 사용 여부: ${redeemed}`);

    // 수정된 부분: BigNumber 대신 단순 비교 사용
    if (balance == 0) {
      throw new Error(
        `❌ 판매자의 NFT(Token ID: ${tokenId}) 보유 수량이 없습니다.`
      );
    }

    if (redeemed) {
      throw new Error(`❌ 이미 사용된 NFT는 판매할 수 없습니다.`);
    }

    if (seller !== ethers.ZeroAddress) {
      throw new Error(`❌ 이미 판매 등록된 NFT입니다.`);
    }

    console.log("🚀 NFT 판매 등록 중...");
    await (
      await gifticonNFTWithSigner.listForSale(serialNumber, sellPrice)
    ).wait(); // tokenId 대신 serialNumber 사용
    console.log(
      `✅ NFT 판매 등록 완료! (Serial Number: ${serialNumber}, 가격: ${ethers.formatEther(
        sellPrice
      )} SSF)`
    );

    const listedPrice = await gifticonNFTWithSigner.getPrice(tokenId);
    console.log(
      `🔍 현재 등록된 NFT 판매 정보 (Token ID: ${tokenId}): 가격=${ethers.formatEther(
        listedPrice
      )} SSF`
    );
  } catch (error) {
    console.error(`❌ 오류 발생: ${error.message}`);
  }
}

// 🔹 스크립트 실행 및 오류 처리
main().catch((error) => {
  console.error("❌ 오류 발생:", error);
  process.exitCode = 1;
});
