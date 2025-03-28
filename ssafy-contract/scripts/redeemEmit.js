const hre = require("hardhat");

async function main() {
  const contractAddress = "0x6940cA1302256204E62D158AF5C835AE3e491d18";
  const contract = await hre.ethers.getContractAt(
    "GifticonNFT",
    contractAddress
  );

  const latestBlock = await hre.ethers.provider.getBlockNumber();
  const fromBlock = latestBlock - 5000; // 최근 5,000블록만 조회
  const toBlock = "latest";

  const filter = contract.filters.Redeemed();
  const events = await contract.queryFilter(filter, fromBlock, toBlock);

  for (const event of events) {
    const { owner, serialNumber } = event.args;
    console.log(
      `✅ Redeemed by ${owner}, Serial #: ${serialNumber}, Block: ${event.blockNumber}`
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
