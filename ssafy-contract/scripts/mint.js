//TODO: 현재 버전에 맞게 수정 예정

const { ethers } = require("hardhat");

async function main() {
  const contractAddress = "0xD023e5dc2b03224293D9341edFb403D10Ed27383"; // 배포된 컨트랙트 주소
  const recipient = "0x4ED78E0a67c2F984D4985D490aAA5bC36340263F"; // 수령자 지갑 주소
  const amount = 10; // 기프티콘 개수

  const GifticonNFT = await ethers.getContractAt(
    "GifticonNFT",
    contractAddress
  );

  console.log("🚀 NFT 민팅 중...");
  const tx = await GifticonNFT.mint(recipient, amount);
  await tx.wait();
  console.log(`✅ NFT 민팅 완료! 수령자: ${recipient}`);

  // ✅ 최신 Token ID 확인
  const latestTokenId = await GifticonNFT.getCurrentTokenId();
  const { ethers } = require("hardhat");

  async function main() {
    const [deployer] = await ethers.getSigners();
    const recipient = "0x4ED78E0a67c2F984D4985D490aAA5bC36340263F"; // 구매자의 지갑 주소
    const contractAddress = "0xD023e5dc2b03224293D9341edFb403D10Ed27383"; // 배포된 컨트랙트 주소

    const GifticonNFT = await ethers.getContractFactory("GifticonNFT");
    const gifticonNFT = await GifticonNFT.attach(contractAddress);

    console.log("GifticonNFT attached to:", gifticonNFT.address);
    console.log("Deployer address:", deployer.address);

    // 초기 민팅 (상품 A: 10개, 상품 B: 10개, 상품 C: 4개, 상품 D: 8개)
    await gifticonNFT.mint(deployer.address, ethers.utils.parseEther("1"), 10); // A
    await gifticonNFT.mint(deployer.address, ethers.utils.parseEther("1"), 10); // B
    await gifticonNFT.mint(deployer.address, ethers.utils.parseEther("1"), 4); // C
    await gifticonNFT.mint(deployer.address, ethers.utils.parseEther("1"), 8); // D

    console.log("NFTs Minted!");

    // 현재 민팅된 토큰 ID 가져오기
    const tokenIdA = await gifticonNFT.getCurrentTokenId(); // 상품 D
    const tokenIdB = tokenIdA.sub(1); // 상품 C
    const tokenIdC = tokenIdB.sub(1); // 상품 B
    const tokenIdD = tokenIdC.sub(1); // 상품 A

    // 판매 등록 (각각 1 ETH 가격으로 등록)
    await gifticonNFT.listForSale(tokenIdD, 10, ethers.utils.parseEther("1"));
    await gifticonNFT.listForSale(tokenIdC, 10, ethers.utils.parseEther("1"));
    await gifticonNFT.listForSale(tokenIdB, 4, ethers.utils.parseEther("1"));
    await gifticonNFT.listForSale(tokenIdA, 8, ethers.utils.parseEther("1"));
    console.log("NFTs Listed for Sale!");

    // 지정된 구매자가 각각 3개씩 구매 (상품 A, B, C, D)
    await gifticonNFT.purchaseNFT(tokenIdD, deployer.address, 3, {
      value: ethers.utils.parseEther("3"),
      from: recipient,
    });
    await gifticonNFT.purchaseNFT(tokenIdC, deployer.address, 3, {
      value: ethers.utils.parseEther("3"),
      from: recipient,
    });
    await gifticonNFT.purchaseNFT(tokenIdB, deployer.address, 3, {
      value: ethers.utils.parseEther("3"),
      from: recipient,
    });
    await gifticonNFT.purchaseNFT(tokenIdA, deployer.address, 3, {
      value: ethers.utils.parseEther("3"),
      from: recipient,
    });

    console.log("NFTs Purchased!");
  }

  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
  console.log(`🎉 발행된 NFT Token ID: ${latestTokenId}`);
  const signer = await ethers.getSigner(recipient); // ✅ recipient가 실행하도록 설정
  const GifticonNFTWithSigner = GifticonNFT.connect(signer); // ✅ recipient가 실행할 수 있도록 컨트랙트 연결
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
