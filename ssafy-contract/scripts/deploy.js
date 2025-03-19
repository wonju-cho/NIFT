const hre = require("hardhat");

async function main() {
  const GifticonNFT = await hre.ethers.getContractFactory("GifticonNFT");
  const gifticonNFT = await GifticonNFT.deploy(); // ✅ 배포 실행

  await gifticonNFT.waitForDeployment(); // ✅ 변경된 부분

  console.log("GifticonNFT deployed to:", gifticonNFT.target); // ✅ 배포된 컨트랙트 주소 출력
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
