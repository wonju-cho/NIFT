const { ethers } = require("hardhat");

async function main() {
  const contractAddress = "0x2D54C90F9831B168B20DB8c0a113d6F10A6AB0C3";
  const recipient = "0x4ED78E0a67c2F984D4985D490aAA5bC36340263F"; // 구매자 주소
  const amount = 10;
  const price = ethers.parseEther("1");

  console.log("🚀 컨트랙트 연결 중...");
  const gifticonNFT = await ethers.getContractAt(
    "GifticonNFT",
    contractAddress
  );

  if (!gifticonNFT) {
    throw new Error("❌ 컨트랙트 연결 실패: 주소 확인 필요");
  }
  console.log("✅ GifticonNFT 컨트랙트 연결됨:", contractAddress);

  // 🔹 배포자의 지갑 주소 가져오기
  const [deployer] = await ethers.getSigners();
  console.log("🛠 Deployer address:", deployer.address);

  // 🔹 NFT 민팅 (배포자가 소유)
  console.log("🚀 NFT 민팅 중...");
  await (await gifticonNFT.mint(deployer.address, price, amount)).wait(); // 상품 A
  await (await gifticonNFT.mint(deployer.address, price, amount)).wait(); // 상품 B
  await (await gifticonNFT.mint(deployer.address, price, 4)).wait(); // 상품 C
  await (await gifticonNFT.mint(deployer.address, price, 8)).wait(); // 상품 D
  console.log("✅ NFTs Minted!");

  // 🔹 최신 민팅된 Token ID 가져오기
  let latestTokenId = await gifticonNFT.getCurrentTokenId();
  latestTokenId = BigInt(latestTokenId.toString());
  console.log(`🎉 최신 발행된 NFT Token ID: ${latestTokenId}`);

  // 🔹 배포자가 구매자(수령자)에게 NFT 전송
  console.log("🚀 구매자에게 NFT 소유권 이전 중...");
  await (
    await gifticonNFT.safeTransferFrom(
      deployer.address,
      recipient,
      latestTokenId - 3n,
      amount,
      "0x"
    )
  ).wait(); // 상품 A
  await (
    await gifticonNFT.safeTransferFrom(
      deployer.address,
      recipient,
      latestTokenId - 2n,
      amount,
      "0x"
    )
  ).wait(); // 상품 B
  await (
    await gifticonNFT.safeTransferFrom(
      deployer.address,
      recipient,
      latestTokenId - 1n,
      4,
      "0x"
    )
  ).wait(); // 상품 C
  await (
    await gifticonNFT.safeTransferFrom(
      deployer.address,
      recipient,
      latestTokenId,
      8,
      "0x"
    )
  ).wait(); // 상품 D
  console.log("✅ NFT 소유권 이전 완료!");

  // 🔹 구매자가 판매 등록 (직접 수행해야 함)
  console.log(
    "🛠 구매자는 자신의 지갑에서 직접 `listForSale`을 호출해야 합니다!"
  );
}

// 🔹 스크립트 실행 및 오류 처리
main().catch((error) => {
  console.error("❌ 오류 발생:", error);
  process.exitCode = 1;
});
