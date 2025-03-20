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
    const initialTokenId = await gifticonNFT.getCurrentTokenId();
    await gifticonNFT.mint(owner.address, parseEther("1"), 10);
    const newTokenId = await gifticonNFT.getCurrentTokenId();
    expect(Number(newTokenId.toString())).to.equal(
      Number(initialTokenId.toString()) + 1
    );
  });

  it("NFT를 판매 목록에 등록해야 한다", async function () {
    await gifticonNFT.mint(owner.address, parseEther("1"), 10);
    const tokenId = await gifticonNFT.getCurrentTokenId();
    await gifticonNFT.listForSale(tokenId, 5, parseEther("2"));

    const listedAmount = await gifticonNFT.getListedAmount(
      tokenId,
      owner.address
    );
    const price = await gifticonNFT.getPrice(tokenId, owner.address);
    expect(listedAmount).to.equal(5);
    expect(price).to.equal(parseEther("2"));
  });

  it("NFT를 구매할 수 있어야 한다", async function () {
    await gifticonNFT.mint(owner.address, parseEther("1"), 10);
    const tokenId = await gifticonNFT.getCurrentTokenId();
    await gifticonNFT.listForSale(tokenId, 5, parseEther("2"));

    // 사용자에게 NFT 전송 권한 부여 (필수)
    await gifticonNFT.setApprovalForAll(user.address, true);

    const tx = await gifticonNFT
      .connect(user)
      .purchaseNFT(tokenId, owner.address, 5, { value: parseEther("10") });
    await expect(tx).to.changeEtherBalances(
      [user, owner],
      [parseEther("-10"), parseEther("10")]
    );

    const balance = await gifticonNFT.balanceOf(user.address, tokenId);
    expect(balance).to.equal(5);
  });

  it("NFT를 사용할 수 있어야 한다", async function () {
    await gifticonNFT.mint(owner.address, parseEther("1"), 1);
    const tokenId = await gifticonNFT.getCurrentTokenId();
    await gifticonNFT.redeem(tokenId);

    const isRedeemed = await gifticonNFT.isRedeemed(tokenId, owner.address);
    expect(isRedeemed).to.be.true;
  });

  it("NFT가 만료된 후에는 사용할 수 없어야 한다", async function () {
    await gifticonNFT.mint(owner.address, parseEther("1"), 1);
    const tokenId = await gifticonNFT.getCurrentTokenId();
    await gifticonNFT.setExpiration(tokenId, Math.floor(Date.now() / 1000) - 1);

    await expect(gifticonNFT.redeem(tokenId)).to.be.revertedWith(
      "This NFT has expired"
    );
  });

  it("NFT를 선물할 수 있어야 한다", async function () {
    await gifticonNFT.mint(owner.address, parseEther("1"), 1);
    const tokenId = await gifticonNFT.getCurrentTokenId();
    await gifticonNFT.giftNFT(otherUser.address, tokenId, 1);

    const balance = await gifticonNFT.balanceOf(otherUser.address, tokenId);
    expect(balance).to.equal(1);
  });

  it("NFT 판매 등록을 취소할 수 있어야 한다", async function () {
    await gifticonNFT.mint(owner.address, parseEther("1"), 10);
    const tokenId = await gifticonNFT.getCurrentTokenId();
    await gifticonNFT.listForSale(tokenId, 5, parseEther("2"));
    await gifticonNFT.cancelSale(tokenId);

    const listedAmount = await gifticonNFT.getListedAmount(
      tokenId,
      owner.address
    );
    expect(listedAmount).to.equal(0);
  });
});
