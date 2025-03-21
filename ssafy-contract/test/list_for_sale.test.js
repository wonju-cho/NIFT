const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("GifticonNFT", function () {
  let GifticonNFT, gifticonNFT;
  let owner, user, other;
  const tokenId = 1001;
  const serialNumbers = [111, 112, 113];
  const price = ethers.utils.parseEther("1");

  beforeEach(async function () {
    [owner, user, other] = await ethers.getSigners();
    GifticonNFT = await ethers.getContractFactory("GifticonNFT");
    gifticonNFT = await GifticonNFT.deploy();
    await gifticonNFT.deployed();

    await gifticonNFT.mintBatchWithSerials(
      owner.address,
      tokenId,
      3,
      serialNumbers,
      price
    );
  });

  it("NFT를 민팅하고 시리얼 넘버를 제대로 저장해야 한다", async function () {
    expect(await gifticonNFT.balanceOf(owner.address, tokenId)).to.equal(3);
    const tokenIdFromSerial = await gifticonNFT.getTokenIdBySerial(
      serialNumbers[0]
    );
    expect(tokenIdFromSerial).to.equal(tokenId);

    const ownerOfSerial = await gifticonNFT.getOwnerOfSerial(serialNumbers[1]);
    expect(ownerOfSerial).to.equal(owner.address);
  });

  it("NFT를 판매 등록하고 조회할 수 있어야 한다", async function () {
    await gifticonNFT.listForSale(serialNumbers[0], price);

    const [listedPrice, seller] = await gifticonNFT.getSerialInfo(
      serialNumbers[0]
    );
    expect(listedPrice).to.equal(price);
    expect(seller).to.equal(owner.address);
  });

  it("NFT를 구매할 수 있어야 한다", async function () {
    await gifticonNFT.listForSale(serialNumbers[0], price);
    await gifticonNFT.setApprovalForAll(user.address, true);

    const buyer = gifticonNFT.connect(user);
    const tx = await buyer.purchaseBySerial(serialNumbers[0], { value: price });

    await expect(tx).to.changeEtherBalances(
      [user, owner],
      [price.mul(-1), price]
    );
    const newOwner = await gifticonNFT.getOwnerOfSerial(serialNumbers[0]);
    expect(newOwner).to.equal(user.address);
    expect(await gifticonNFT.balanceOf(user.address, tokenId)).to.equal(1);
  });

  it("NFT를 사용할 수 있어야 한다", async function () {
    await gifticonNFT.redeem(serialNumbers[1]);
    const [, , , , isRedeemed] = await gifticonNFT.getSerialInfo(
      serialNumbers[1]
    );
    expect(isRedeemed).to.be.true;
  });

  it("NFT가 만료되면 사용할 수 없어야 한다", async function () {
    // 시간 91일 증가
    await ethers.provider.send("evm_increaseTime", [91 * 24 * 60 * 60]);
    await ethers.provider.send("evm_mine");

    await expect(gifticonNFT.redeem(serialNumbers[2])).to.be.revertedWith(
      "Expired"
    );
  });

  it("NFT를 선물할 수 있어야 한다", async function () {
    await gifticonNFT.giftNFT(other.address, serialNumbers[1]);
    const newOwner = await gifticonNFT.getOwnerOfSerial(serialNumbers[1]);
    expect(newOwner).to.equal(other.address);
    expect(await gifticonNFT.balanceOf(other.address, tokenId)).to.equal(1);
  });

  it("NFT 판매 등록을 취소할 수 있어야 한다", async function () {
    await gifticonNFT.listForSale(serialNumbers[2], price);
    await gifticonNFT.cancelSale(serialNumbers[2]);

    const [cancelledPrice] = await gifticonNFT.getSerialInfo(serialNumbers[2]);
    expect(cancelledPrice).to.equal(0);
  });

  it("사용 시 redeemedAt 타임스탬프가 기록되어야 한다", async function () {
    const tx = await gifticonNFT.redeem(serialNumbers[0]);
    const block = await ethers.provider.getBlock(tx.blockNumber);

    const [, , , , isRedeemed, redeemedAt] = await gifticonNFT.getSerialInfo(
      serialNumbers[0]
    );
    expect(isRedeemed).to.be.true;
    expect(redeemedAt).to.equal(block.timestamp);
  });

  it("사용한 NFT는 다시 판매할 수 없어야 한다", async function () {
    await gifticonNFT.redeem(serialNumbers[0]);
    await expect(
      gifticonNFT.listForSale(serialNumbers[0], price)
    ).to.be.revertedWith("Already redeemed");
  });

  it("존재하지 않는 시리얼 넘버 접근 시 revert 되어야 한다", async function () {
    const invalidSerial = 999999;
    await expect(gifticonNFT.getTokenIdBySerial(invalidSerial)).to.be.reverted; // 매핑 값 0이면 revert 아님, 값 자체가 0 반환될 수 있음 → 후속 체크

    // 예: 없는 serial에 대해 redeem 시도
    await expect(gifticonNFT.redeem(invalidSerial)).to.be.revertedWith(
      "Not owner"
    );

    // 예: 구매 시도
    await expect(
      gifticonNFT.purchaseBySerial(invalidSerial, { value: price })
    ).to.be.revertedWith("Not listed");
  });
});
