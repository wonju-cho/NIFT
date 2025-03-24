//TODO: 현재 버전에 맞게 수정 예정

const { ethers } = require("hardhat");

async function main() {
  const contractAddress = "0xaf0105d9DC9B750a659d97ef2800c1b331de0258";
  const tokenId = 1;

  // ✅ 컨트랙트 가져오기
  const GifticonNFT = await ethers.getContractAt(
    "GifticonNFT",
    contractAddress
  );

  // ✅ NFT 사용 처리
  const tx = await GifticonNFT.redeem(tokenId);
  await tx.wait();

  console.log(`✅ NFT (ID: ${tokenId}) 사용 완료!`);
}

// 실행
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
