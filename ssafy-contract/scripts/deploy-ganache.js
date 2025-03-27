const hre = require("hardhat");

async function main() {
  const GifticonETH = await hre.ethers.getContractFactory("GifticonETH");
  const gifticonETH = await GifticonETH.deploy(); // ✅ 배포 실행

  await gifticonETH.waitForDeployment();

  console.log("GifticonNFT deployed to:", gifticonETH.target); // ✅ 배포된 컨트랙트 주소 출력
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
