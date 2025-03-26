require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
  const contractAddress = "0x6F55cffCff54cA706623CF9A17C6fC5e0b21955e"; // GifticonNFT
  const sellerAddress = "0xE0bA992C60406310372Df97f4c218fBb8eaf8271";
  const ssfDecimals = 0; // SSF 토큰이 0 decimal일 경우

  const serialNumber = BigInt(process.argv[2]).toString();
  const sellPrice = ethers.parseUnits(process.argv[3] || "1", ssfDecimals); // 기본값 1 SSF

  if (!serialNumber || !sellPrice) {
    throw new Error("❌ serialNumber와 sellPrice를 모두 입력하세요.");
  }

  console.log(`🚀 Ganache RPC 연결 중...`);
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:7545"); // Ganache 로컬 네트워크

  const privateKey = process.env.TEST_PRIVATE_KEY2;
  if (!privateKey) {
    throw new Error("❌ .env에 TEST_PRIVATE_KEY2가 설정되지 않았습니다.");
  }

  const signer = new ethers.Wallet(privateKey, provider);
  console.log("서명자 주소:", signer.address);
  console.log("판매자 주소:", sellerAddress);

  if (signer.address.toLowerCase() !== sellerAddress.toLowerCase()) {
    throw new Error("❌ 서명자 주소가 판매자 주소와 일치하지 않습니다.");
  }

  console.log(`🛠 판매자 주소: ${signer.address}`);

  const gifticonNFT = await ethers.getContractAt(
    "GifticonNFT",
    contractAddress,
    signer
  );

  // ✅ 컨트랙트에 NFT 전송 권한 위임
  const isApproved = await gifticonNFT.isApprovedForAll(
    sellerAddress,
    contractAddress
  );
  if (!isApproved) {
    console.log("🔑 NFT 전송 권한 위임 중...");
    const approveTx = await gifticonNFT.setApprovalForAll(
      contractAddress,
      true
    );
    await approveTx.wait();
    console.log("✅ 컨트랙트에 NFT 전송 권한 부여 완료");
  }

  try {
    console.log(`🔍 시리얼 넘버(${serialNumber})로 tokenId 조회 중...`);
    const tokenId = await gifticonNFT.getTokenIdBySerial(serialNumber);
    console.log(`📌 tokenId: ${tokenId}`);

    const serialInfo = await gifticonNFT.getSerialInfo(serialNumber);
    const redeemed = serialInfo[4];
    const seller = serialInfo[1];

    if (redeemed) throw new Error("❌ 이미 사용된 NFT입니다.");
    if (seller !== ethers.ZeroAddress)
      throw new Error("❌ 이미 판매 등록된 NFT입니다.");

    console.log("🚀 판매 등록 중...");
    const tx = await gifticonNFT.listForSale(serialNumber, sellPrice);
    await tx.wait();

    const updatedInfo = await gifticonNFT.getSerialInfo(serialNumber);
    const updatedPrice = updatedInfo[0];
    const updatedSeller = updatedInfo[1];
    const newOwner = updatedInfo[2];

    console.log("✅ 판매 등록 완료!");
    console.log(`📌 등록된 판매자: ${updatedSeller}`);
    console.log(`📦 NFT 현재 소유자 (컨트랙트가 보유): ${newOwner}`);
    console.log(
      `💰 판매 가격: ${ethers.formatUnits(updatedPrice, ssfDecimals)} SSF`
    );
  } catch (err) {
    console.error(`❌ 오류 발생: ${err.message}`);
  }
}

main().catch((err) => {
  console.error("❌ 실행 중 오류:", err);
  process.exit(1);
});
