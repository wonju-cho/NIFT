const hre = require("hardhat");
const { artifacts } = require("hardhat");
const fs = require("fs");
const path = require("path"); // 이 줄이 추가되어야 합니다.

async function main() {
  const ssfTokenAddress = "0xecA3EA9777824CEA1A1fEF9163F32d3B9b22aAef";
  const GifticonNFT = await hre.ethers.getContractFactory("GifticonNFT");
  const gifticonNFT = await GifticonNFT.deploy(ssfTokenAddress); // ✅ 배포 실행

  await gifticonNFT.waitForDeployment();

  console.log("GifticonNFT deployed to:", gifticonNFT.target); // ✅ 배포된 컨트랙트 주소 출력
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
