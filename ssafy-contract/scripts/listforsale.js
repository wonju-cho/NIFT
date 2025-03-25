require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
  const contractAddress = "0xf7A8d75aF63fb1412CdC03519fD4d3463E088EBf";
  const sellerAddress = "0x4ED78E0a67c2F984D4985D490aAA5bC36340263F";

  const serialNumber = BigInt(process.argv[2]).toString();
  const sellPrice = ethers.parseUnits("1", 0);

  if (!serialNumber || !sellPrice) {
    throw new Error("❌ serialNumber와 sellPrice를 모두 입력하세요.");
  }

  console.log(`🚀 SSAFY RPC 연결 중...`);
  const provider = new ethers.JsonRpcProvider(
    "https://rpc.ssafy-blockchain.com"
  );

  const privateKey = process.env.TEST_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error("❌ .env에 TEST_PRIVATE_KEY가 설정되지 않았습니다.");
  }

  const signer = new ethers.Wallet(privateKey, provider);

  if (signer.address.toLowerCase() !== sellerAddress.toLowerCase()) {
    throw new Error(`❌ 서명자 주소가 판매자 주소와 일치하지 않습니다.`);
  }

  console.log(`🛠 판매자 주소: ${signer.address}`);

  const gifticonNFT = await ethers.getContractAt(
    "GifticonNFT",
    contractAddress,
    signer
  );

  try {
    console.log(`🔍 시리얼 넘버(${serialNumber})로 tokenId 조회 중...`);
    let tokenId;

    try {
      tokenId = await gifticonNFT.getTokenIdBySerial(serialNumber.toString());
    } catch {
      throw new Error(
        `❌ 해당 시리얼 넘버(${serialNumber})에 대한 tokenId가 존재하지 않습니다.`
      );
    }

    console.log(`📌 tokenId: ${tokenId}`);

    const balance = await gifticonNFT.balanceOf(sellerAddress, tokenId);
    if (balance == 0) {
      throw new Error("❌ 해당 NFT를 보유하고 있지 않습니다.");
    }

    const serialInfo = await gifticonNFT.getSerialInfo(serialNumber);
    const price = serialInfo[0];
    const seller = serialInfo[1];
    const owner = serialInfo[2];
    const redeemed = serialInfo[4];

    console.log(`📦 보유량: ${balance}`);
    console.log(`👤 현재 소유자: ${owner}`);
    console.log(`💰 기존 가격: ${ethers.formatEther(price)} SSF`);
    console.log(`📌 등록된 판매자: ${seller}`);
    console.log(`🎟️ 사용됨?: ${redeemed}`);

    if (redeemed) throw new Error("❌ 이미 사용된 NFT입니다.");
    if (seller !== ethers.ZeroAddress)
      throw new Error("❌ 이미 판매 등록된 NFT입니다.");

    console.log("🚀 판매 등록 중...");
    const tx = await gifticonNFT.listForSale(serialNumber, sellPrice);
    await tx.wait();

    console.log("✅ 판매 등록 완료!");
    console.log("🔍 등록 정보 다시 조회 중...");

    const updatedInfo = await gifticonNFT.getSerialInfo(serialNumber);
    const updatedPrice = updatedInfo[0];
    const updatedSeller = updatedInfo[1];

    console.log(`📌 등록된 판매자 주소: ${updatedSeller}`);
    console.log(`💰 등록된 가격: ${ethers.formatEther(updatedPrice)} SSF`);
  } catch (err) {
    console.error(`❌ 오류 발생: ${err.message}`);
  }
}

main().catch((err) => {
  console.error("❌ 실행 중 오류:", err);
  process.exit(1);
});
