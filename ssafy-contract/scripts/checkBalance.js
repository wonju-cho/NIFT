const { ethers } = require("hardhat");

async function main() {
  const contractAddress = "0xaf0105d9DC9B750a659d97ef2800c1b331de0258"; // 배포된 NFT 컨트랙트 주소
  const ownerAddress = "0xd01FF3bC2b608151d2cCCD5966B158658dA6e6ad"; // NFT 보유자 지갑 주소
  const tokenId = 2; // 확인할 NFT ID

  // ✅ 배포된 컨트랙트 가져오기
  const GifticonNFT = await ethers.getContractAt(
    "GifticonNFT",
    contractAddress
  );

  // ✅ 지갑의 NFT 보유량 확인
  const balance = await GifticonNFT.balanceOf(ownerAddress, tokenId);

  console.log(`✅ ${ownerAddress}의 NFT 보유량: ${balance.toString()}`);
}

// 실행
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
