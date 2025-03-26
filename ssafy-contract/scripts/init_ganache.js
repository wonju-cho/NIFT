const { ethers } = require("hardhat");
const { execSync } = require("child_process");

async function main() {
  const contractAddress = "0x6F55cffCff54cA706623CF9A17C6fC5e0b21955e";
  const sellerAddress = "0xE0bA992C60406310372Df97f4c218fBb8eaf8271";

  const tokenId = 2;
  const mintAmount = 4;

  const ssfDecimals = 0; // ✅ SSF 소수점이 없으면 0, 있으면 18로 설정
  const price = ethers.parseUnits("10", ssfDecimals); // 민팅 시 설정할 가격 (10 SSF)

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
    deployer.address,
    tokenId,
    mintAmount,
    price,
    name,
    description,
    metadataURI
  );
  const receipt = await tx.wait();
  console.log("✅ 민팅 완료");

  // 🔍 Minted 이벤트로부터 시리얼 넘버 추출
  console.log("🔍 시리얼 넘버 추출 중...");
  const topicMinted = ethers.id("Minted(address,uint256,uint256)");
  const logs = receipt.logs.filter((log) => log.topics[0] === topicMinted);

  const serials = logs.map((log) => {
    const parsed = gifticonNFT.interface.parseLog(log);
    return parsed.args.serialNumber.toString();
  });

  console.log("✅ 추출된 시리얼 넘버:", serials);

  // 🚚 판매자에게 전송
  console.log("🚚 판매자에게 NFT 전송 중...");
  for (const serial of serials) {
    const serialInfo = await gifticonNFT.getSerialInfo(serial);
    const actualOwner = serialInfo.owner; // 실제 소유자 확인
    const expectedOwner = sellerAddress; // 판매자 주소

    console.log(`📌 Serial ${serial} - 실제 소유자: ${actualOwner}`);
    console.log(`🤖 기대하는 판매자 주소: ${expectedOwner}`);

    // 트랜잭션을 보내는 부분
    const tx = await gifticonNFT
      .connect(deployer)
      .giftNFT(sellerAddress, serial);

    const receipt = await tx.wait(); // 트랜잭션이 완료되었는지 기다림
    console.log(
      `🔄 전송 완료: Serial ${serial} - 트랜잭션 해시: ${receipt.transactionHash}`
    );

    // 다시 소유자 확인
    const newSerialInfo = await gifticonNFT.getSerialInfo(serial);
    const newOwner = newSerialInfo.owner;

    if (newOwner.toLowerCase() === expectedOwner.toLowerCase()) {
      console.log(
        `✅ Serial ${serial} - NFT가 정상적으로 판매자에게 전송되었습니다.`
      );
    } else {
      console.log(
        `❌ Serial ${serial} - NFT가 판매자에게 전송되지 않았습니다. 현재 소유자: ${newOwner}`
      );
    }
  }
  // ✅ 자동 판매 등록
  console.log("🎉 전송 완료! 이제 전부 자동 판매 등록 시작");

  const sellPrice = ethers.parseUnits("1", ssfDecimals); // 등록 가격 (1 SSF)

  for (const serial of serials) {
    console.log(`🚀 listForSale_ganache.js 실행 중 (Serial: ${serial})`);
    try {
      execSync(
        `node scripts/listForSale_ganache.js ${serial} ${sellPrice.toString()}`,
        {
          stdio: "inherit",
        }
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
