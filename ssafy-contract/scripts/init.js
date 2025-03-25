const { ethers } = require("hardhat");
const { execSync } = require("child_process");

async function main() {
  const contractAddress = "0xf7A8d75aF63fb1412CdC03519fD4d3463E088EBf";
  const sellerAddress = "0x4ED78E0a67c2F984D4985D490aAA5bC36340263F";

  const tokenId = 1;
  const mintAmount = 4;
  const price = ethers.parseEther("0.01");
  const name = "스타벅스 기프티콘";
  const description = "아메리카노 T size";
  const metadataURI =
    "ipfs://bafkreifj53t5ciradsorecuagrasftt4pfercqvjuhyrhks2piwokho2iy";

  const gifticonNFT = await ethers.getContractAt(
    "GifticonNFT",
    contractAddress
  );
  const [deployer] = await ethers.getSigners();

  console.log("🚀 NFT 민팅 중...");
  const tx = await gifticonNFT.mintBatchWithSerials(
    deployer.address, // 배포자 주소로 민팅
    tokenId,
    mintAmount,
    price,
    name,
    description,
    metadataURI
  );
  const receipt = await tx.wait();
  console.log("✅ 민팅 완료");

  // Minted 이벤트로부터 시리얼 넘버 추출
  console.log("🔍 시리얼 넘버 추출 중...");
  const topicMinted = ethers.id("Minted(address,uint256,uint256)");
  const logs = receipt.logs.filter((log) => log.topics[0] === topicMinted);

  const serials = logs.map((log) => {
    const parsed = gifticonNFT.interface.parseLog(log);
    return parsed.args.serialNumber.toString();
  });

  console.log("✅ 추출된 시리얼 넘버:", serials);

  // 판매자에게 NFT 전송
  console.log("🚚 판매자에게 NFT 전송 중...");
  for (const serial of serials) {
    const tx = await gifticonNFT.giftNFT(sellerAddress, serial);
    await tx.wait();
    console.log(`🔄 전송 완료: Serial ${serial}`);
  }

  console.log("🎉 전송 완료! 이제 전부 자동 판매 등록 시작");
  const sellPrice = ethers.parseUnits("1", 0);

  for (const serial of serials) {
    console.log(`🚀 listForSale.js 실행 중 (Serial: ${serial})`);
    try {
      execSync(
        `node scripts/listForSale.js ${serial} ${sellPrice.toString()}`,
        { stdio: "inherit" }
      );
    } catch (error) {
      console.error(`❌ listForSale.js 실행 중 오류 발생:`, error.message);
    }
  }
}

main().catch((err) => {
  console.error("❌ 실행 오류:", err.message);
  process.exit(1);
});
