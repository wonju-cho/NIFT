const { ethers } = require("hardhat");

async function main() {
  const contractAddress = "0x890e0B01283d6bD321Da88c57606B5eAD0955Fb5"; // 배포된 컨트랙트 주소
  const recipient = "0x4ED78E0a67c2F984D4985D490aAA5bC36340263F"; // 수령자 지갑 주소
  const amount = 10; // 기프티콘 개수

  const GifticonNFT = await ethers.getContractAt(
    "GifticonNFT",
    contractAddress
  );

  console.log("🚀 NFT 민팅 중...");
  const tx = await GifticonNFT.mint(recipient, amount);
  await tx.wait();
  console.log(`✅ NFT 민팅 완료! 수령자: ${recipient}`);

  // ✅ 최신 Token ID 확인
  const latestTokenId = await GifticonNFT.getCurrentTokenId();
  console.log(`🎉 발행된 NFT Token ID: ${latestTokenId}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
