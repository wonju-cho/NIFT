// main.js (수정된 버전)
const { ethers } = require("hardhat");
const { execSync } = require("child_process");

async function main() {
  const contractAddress = "0xEAc580119cad82b6ffB63A58269F1A66A97EB590";
  const recipient = "0x4ED78E0a67c2F984D4985D490aAA5bC36340263F"; // 구매자 주소
  const amount = 1;
  const initialPrice = ethers.parseEther("0.01"); // 초기 판매 가격 설정 (예시)
  const sellPrice = ethers.parseEther("1"); // 판매 가격 설정

  console.log("🚀 컨트랙트 연결 중...");
  const gifticonNFT = await ethers.getContractAt(
    "GifticonNFT",
    contractAddress
  );

  if (!gifticonNFT) {
    throw new Error("❌ 컨트랙트 연결 실패: 주소 확인 필요");
  }
  console.log("✅ GifticonNFT 컨트랙트 연결됨:", contractAddress);

  // 🔹 배포자의 지갑 주소 가져오기
  const [deployer] = await ethers.getSigners();
  console.log("🛠 Deployer address:", deployer.address);

  // 🔹 NFT 민팅 (배포자가 소유)
  console.log("🚀 NFT 민팅 중...");
  const mintStartTime = Date.now();
  for (let i = 0; i < 4; i++) {
    const serialNumber = mintStartTime + i;
    await (
      await gifticonNFT.mint(deployer.address, initialPrice, serialNumber)
    ).wait(); // 시리얼 넘버를 임의로 설정 (실제 사용 시 의미있는 값으로 변경)
  }
  console.log("✅ NFTs Minted!");

  // 🔹 최신 민팅된 Token ID 가져오기
  let latestTokenId = await gifticonNFT.getCurrentTokenId();
  latestTokenId = BigInt(latestTokenId.toString());
  console.log(`🎉 최신 발행된 NFT Token ID: ${latestTokenId}`);

  // 🔹 배포자가 구매자(수령자)에게 NFT 전송
  console.log("🚀 구매자에게 NFT 소유권 이전 중...");
  for (let i = 3n; i >= 0n; i--) {
    await (
      await gifticonNFT.safeTransferFrom(
        deployer.address,
        recipient,
        latestTokenId - i,
        amount,
        "0x"
      )
    ).wait();
  }
  console.log("✅ NFT 소유권 이전 완료!");

  // 🔹 구매자가 NFT를 소유하고 있는지 확인
  let balance = await gifticonNFT.balanceOf(recipient, latestTokenId);
  console.log(`🔍 구매자(${recipient})의 NFT 보유 수량: ${balance}`);

  if (balance <= 0) {
    throw new Error("❌ 구매자가 NFT를 보유하고 있지 않습니다.");
  }

  // ✅ `listForSale.js` 실행 (최신 tokenId 넘기기)
  console.log(`🚀 listForSale.js 실행 중 (Token ID: ${latestTokenId})`);
  try {
    // Calculate the serial number of the latest minted NFT
    const serialNumberToSell = mintStartTime + 3; // Assuming 4 NFTs minted (token IDs 1 to 4)
    execSync(
      `node scripts/listForSale.js ${serialNumberToSell} ${sellPrice.toString()}`,
      { stdio: "inherit" }
    );
  } catch (error) {
    console.error(`❌ listForSale.js 실행 중 오류 발생:`, error);
  }
}

// 🔹 스크립트 실행 및 오류 처리
main().catch((error) => {
  console.error("❌ 오류 발생:", error);
  process.exitCode = 1;
});
