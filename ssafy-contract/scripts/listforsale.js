require("dotenv").config(); // 환경변수 로드
const { ethers } = require("hardhat");

async function main() {
  const contractAddress = "0x2D54C90F9831B168B20DB8c0a113d6F10A6AB0C3";
  const buyerAddress = "0x4ED78E0a67c2F984D4985D490aAA5bC36340263F"; // ✅ 지정된 주소
  const tokenId = 1; // 판매할 NFT의 Token ID
  const sellAmount = 5; // 판매할 개수
  const sellPrice = ethers.parseEther("1.5"); // NFT 개당 판매 가격 (1.5 SSF)

  console.log("🚀 SSAFY 네트워크 연결 중...");

  // ✅ SSAFY 네트워크 Provider 설정
  const provider = new ethers.JsonRpcProvider(
    "https://rpc.ssafy-blockchain.com"
  );

  // ✅ 환경변수에서 Private Key 로드 (process.env.TEST_PRIVATE_KEY 사용)
  const privateKey = process.env.TEST_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error(
      "❌ PRIVATE_KEY가 설정되지 않았습니다. .env 파일을 확인하세요."
    );
  }

  // ✅ 지갑 생성 (지정된 주소로 설정)
  const signer = new ethers.Wallet(privateKey, provider);

  // ✅ 강제적으로 주소 지정 (PRIVATE_KEY가 지정된 주소와 일치하는지 확인)
  if (signer.address.toLowerCase() !== buyerAddress.toLowerCase()) {
    throw new Error(
      `❌ PRIVATE_KEY가 ${buyerAddress} 주소와 일치하지 않습니다.`
    );
  }

  console.log(`🛠 서명자 주소 (지정된 주소 사용): ${buyerAddress}`);

  // ✅ 컨트랙트 가져오기
  const gifticonNFT = await ethers.getContractAt(
    "GifticonNFT",
    contractAddress,
    signer
  );

  // ✅ 판매 등록
  console.log("🚀 NFT 판매 등록 중...");
  await (await gifticonNFT.listForSale(tokenId, sellAmount, sellPrice)).wait();
  console.log(
    `✅ NFT 판매 등록 완료! (Token ID: ${tokenId}, 수량: ${sellAmount}, 가격: ${sellPrice} SSF)`
  );

  // ✅ 등록된 판매 정보 확인
  const listedAmount = await gifticonNFT.getListedAmount(tokenId, buyerAddress);
  const listedPrice = await gifticonNFT.getPrice(tokenId, buyerAddress);
  console.log(
    `🔍 현재 등록된 NFT 판매 정보: 개수=${listedAmount}, 가격=${ethers.formatEther(
      listedPrice
    )} SSF`
  );
}

// 🔹 스크립트 실행 및 오류 처리
main().catch((error) => {
  console.error("❌ 오류 발생:", error);
  process.exitCode = 1;
});
