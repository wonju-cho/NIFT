const hre = require("hardhat");
const { expect } = require("chai");
const ethers = hre.ethers;

describe("GifticonNFT", function () {
  let GifticonNFT, gifticonNFT, owner, addr1, addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    GifticonNFT = await ethers.getContractFactory("GifticonNFT");
    gifticonNFT = await GifticonNFT.deploy();
  });

  it("NFT를 민팅할 수 있어야 한다.", async function () {
    await gifticonNFT.mint(addr1.address, ethers.parseEther("1"), 5);
    expect(await gifticonNFT.balanceOf(addr1.address, 1)).to.equal(5);
  });

  it("NFT를 판매 목록에 등록할 수 있어야 한다.", async function () {
    await gifticonNFT.mint(addr1.address, ethers.parseEther("1"), 5);
    await gifticonNFT.connect(addr1).listForSale(1, 2, ethers.parseEther("1"));

    expect(await gifticonNFT.getListedAmount(1, addr1.address)).to.equal(2);
    expect(await gifticonNFT.getPrice(1, addr1.address)).to.equal(
      ethers.parseEther("1")
    );
  });

  it("NFT를 구매할 수 있어야 한다.", async function () {
    await gifticonNFT.mint(addr1.address, ethers.parseEther("1"), 5);
    await gifticonNFT.connect(addr1).listForSale(1, 2, ethers.parseEther("1"));

    // ✅ 판매자가 구매자를 위한 승인 추가
    await gifticonNFT.connect(addr1).setApprovalForAll(addr2.address, true);

    await gifticonNFT
      .connect(addr2)
      .purchaseNFT(1, addr1.address, 2, { value: ethers.parseEther("2") });

    expect(await gifticonNFT.balanceOf(addr2.address, 1)).to.equal(2);
    expect(await gifticonNFT.getListedAmount(1, addr1.address)).to.equal(0);
  });

  it("NFT를 사용(소진)할 수 있어야 한다.", async function () {
    await gifticonNFT.mint(addr1.address, ethers.parseEther("1"), 5);

    await gifticonNFT.connect(addr1).redeem(1);
    expect(await gifticonNFT.isRedeemed(1, addr1.address)).to.equal(true);
  });

  it("사용한 NFT는 다시 사용할 수 없어야 한다.", async function () {
    await gifticonNFT.mint(addr1.address, ethers.parseEther("1"), 5);
    await gifticonNFT.connect(addr1).redeem(1);

    await expect(gifticonNFT.connect(addr1).redeem(1)).to.be.revertedWith(
      "This NFT has already been redeemed"
    );
  });

  it("NFT 구매 시 충분한 금액이 없으면 실패해야 한다.", async function () {
    await gifticonNFT.mint(addr1.address, ethers.parseEther("1"), 5);
    await gifticonNFT.connect(addr1).listForSale(1, 2, ethers.parseEther("1"));

    await expect(
      gifticonNFT
        .connect(addr2)
        .purchaseNFT(1, addr1.address, 2, { value: ethers.parseEther("1") })
    ).to.be.revertedWith("Insufficient payment");
  });

  it("NFT 구매 시 판매자가 충분한 수량을 등록하지 않았다면 실패해야 한다.", async function () {
    await gifticonNFT.mint(addr1.address, ethers.parseEther("1"), 5);
    await gifticonNFT.connect(addr1).listForSale(1, 1, ethers.parseEther("1"));

    await expect(
      gifticonNFT
        .connect(addr2)
        .purchaseNFT(1, addr1.address, 2, { value: ethers.parseEther("2") })
    ).to.be.revertedWith("Not enough NFTs listed for sale");
  });
});
