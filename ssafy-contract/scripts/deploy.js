const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const ssfTokenAddress = "0xecA3EA9777824CEA1A1fEF9163F32d3B9b22aAef";
  const GifticonNFT = await hre.ethers.getContractFactory("GifticonNFT");
  const gifticonNFT = await GifticonNFT.deploy(ssfTokenAddress);

  await gifticonNFT.waitForDeployment();

  const contractAddress = gifticonNFT.target;
  console.log("GifticonNFT deployed to:", contractAddress);

  // Save the contract address to a JSON file
  const contractsDir = path.join(__dirname, "../../admin/lib/contracts");
  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir, { recursive: true });
  }
  const contractData = {
    address: contractAddress,
    abi: require("../artifacts/contracts/GifticonNFT.sol/GifticonNFT.json").abi,
  };
  fs.writeFileSync(
    path.join(contractsDir, "GifticonNFT.json"),
    JSON.stringify(contractData, null, 2)
  );

  console.log(
    "Contract address and ABI saved to admin/lib/contracts/GifticonNFT.json"
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
