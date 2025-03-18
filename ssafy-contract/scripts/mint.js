const { ethers } = require("hardhat");

async function main() {
  const contractAddress = "0x2A7Dd26D1747AdF51E7e8F82B65bB50BC2724419"; // 배포된 컨트랙트 주소
  const recipient = "0xd01FF3bC2b608151d2cCCD5966B158658dA6e6ad"; // 수령자 지갑 주소
  const amount = 1; // 기프티콘 개수

  // ✅ 컨트랙트 가져오기
  const GifticonNFT = await ethers.getContractAt(
    "GifticonNFT",
    contractAddress
  );

  // ✅ NFT 민팅 실행
  const tx = await GifticonNFT.mint(recipient, amount);
  await tx.wait();

  console.log(
    `✅ 기프티콘 NFT 발급 완료! ${recipient} 에게 ${amount} 개 지급됨.`
  );
}

// 실행
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
