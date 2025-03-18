const fs = require("fs");
const path = require("path");
const GifticonNFT = artifacts.require("GifticonNFT");

module.exports = async function (callback) {
  try {
    // ✅ JSON 파일 로드
    const metadataPath = path.join(__dirname, "../metadata/1.json");
    const metadata = JSON.parse(fs.readFileSync(metadataPath, "utf8"));

    // ✅ 배포된 컨트랙트 가져오기
    const nft = await GifticonNFT.deployed();

    // ✅ JSON 데이터로 NFT 민팅 실행
    const tx = await nft.mint(
      "0xYourWalletAddress", // 수신자 주소
      1, // Token ID
      metadata.name,
      metadata.description,
      metadata.image,
      Math.floor(new Date(metadata.expiryDate).getTime() / 1000), // 타임스탬프로 변환
      { from: "0xYourWalletAddress" }
    );

    console.log("✅ NFT Minted Successfully!");
    console.log("Transaction Hash:", tx.tx);

    callback();
  } catch (error) {
    console.error("❌ Error minting NFT:", error);
    callback(error);
  }
};
