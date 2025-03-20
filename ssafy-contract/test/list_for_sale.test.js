const { expect } = require("chai");
const { ethers } = require("hardhat");
const { parseEther } = ethers;

describe("GifticonNFT", function () {
  let GifticonNFT, gifticonNFT;
  let owner, user, otherUser;

  beforeEach(async function () {
    [owner, user, otherUser] = await ethers.getSigners();
    GifticonNFT = await ethers.getContractFactory("GifticonNFT");
    gifticonNFT = await GifticonNFT.deploy();
  });

  it("새로운 NFT를 민팅해야 한다", async function () {
    await gifticonNFT.mint(owner.address, 1);
    expect(await gifticonNFT.balanceOf(owner.address, 1)).to.equal(1);
  });

  it("NFT를 판매 목록에 등록해야 한다", async function () {
    await gifticonNFT.mint(owner.address, 1);
    await gifticonNFT.listForSale(1, 1, parseEther("2"));

    const price = await gifticonNFT.getPrice(1, 1);
    expect(price).to.equal(parseEther("2"));
  });

  it("NFT를 구매할 수 있어야 한다", async function () {
    await gifticonNFT.mint(owner.address, 1);
    await gifticonNFT.listForSale(1, 1, parseEther("2"));

    await gifticonNFT.setApprovalForAll(user.address, true);

    const tx = await gifticonNFT
      .connect(user)
      .purchaseNFT(1, 1, { value: parseEther("2") });
    await expect(tx).to.changeEtherBalances(
      [user, owner],
      [parseEther("-2"), parseEther("2")]
    );

    expect(await gifticonNFT.balanceOf(user.address, 1)).to.equal(1);
  });

  it("NFT를 사용할 수 있어야 한다", async function () {
    await gifticonNFT.mint(owner.address, 1);
    await gifticonNFT.redeem(1, 1);
    expect(await gifticonNFT.isRedeemed(1, 1)).to.be.true;
  });

  it("NFT가 만료된 후에는 사용할 수 없어야 한다", async function () {
    await gifticonNFT.mint(owner.address, 1);
    await ethers.provider.send("evm_increaseTime", [90 * 24 * 60 * 60]);
    await ethers.provider.send("evm_mine");

    await expect(gifticonNFT.redeem(1, 1)).to.be.revertedWith(
      "This NFT has expired"
    );
  });

  it("NFT를 선물할 수 있어야 한다", async function () {
    await gifticonNFT.mint(owner.address, 1);
    await gifticonNFT.safeTransferFrom(
      owner.address,
      otherUser.address,
      1,
      1,
      "0x"
    );

    expect(await gifticonNFT.balanceOf(otherUser.address, 1)).to.equal(1);
  });

  it("NFT 판매 등록을 취소할 수 있어야 한다", async function () {
    await gifticonNFT.mint(owner.address, 1);
    await gifticonNFT.listForSale(1, 1, parseEther("2"));
    await gifticonNFT.cancelSale(1, 1);

    const price = await gifticonNFT.getPrice(1, 1);
    expect(price).to.equal(0);
  });
});
