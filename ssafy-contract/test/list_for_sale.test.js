const { expect } = require("chai");
const { ethers } = require("hardhat");
const { parseEther } = ethers;

describe("GifticonNFT (Serial-based)", function () {
  let gifticonNFT, owner, user, otherUser;
  const tokenId = 1;
  const amount = 1;
  const price = parseEther("1");

  // 🔍 이벤트 로그에서 serialNumber 추출
  async function getSerialNumbersFromLogs(tx, contract) {
    const receipt = await tx.wait();
    const iface = contract.interface;
    const serialNumbers = [];

    for (const log of receipt.logs) {
      try {
        const parsedLog = iface.parseLog(log);
        if (parsedLog.name === "Minted") {
          serialNumbers.push(parsedLog.args.serialNumber);
        }
      } catch (_) {}
    }

    if (serialNumbers.length === 0) {
      throw new Error("❌ Minted 이벤트를 logs에서 찾을 수 없습니다.");
    }

    return serialNumbers;
  }

  beforeEach(async function () {
    [owner, user, otherUser] = await ethers.getSigners();
    const GifticonNFT = await ethers.getContractFactory("GifticonNFT");
    gifticonNFT = await GifticonNFT.deploy();
  });

  it("시리얼 넘버를 포함한 NFT를 민팅해야 한다", async function () {
    const tx = await gifticonNFT.mintBatchWithSerials(
      owner.address,
      tokenId,
      amount,
      price,
      "Coffee Coupon",
      "스타벅스 아메리카노 기프티콘",
      "ipfs://metadata"
    );
    const [serialNumber] = await getSerialNumbersFromLogs(tx, gifticonNFT);

    const info = await gifticonNFT.getSerialInfo(serialNumber);
    expect(info.owner).to.equal(owner.address);
    expect(info.price).to.equal(price);
    expect(info.isRedeemed).to.equal(false);
  });

  it("NFT를 시리얼 넘버 기반으로 판매 등록해야 한다", async function () {
    const tx = await gifticonNFT.mintBatchWithSerials(
      owner.address,
      tokenId,
      1,
      price,
      "Name",
      "Desc",
      "URI"
    );
    const [serialNumber] = await getSerialNumbersFromLogs(tx, gifticonNFT);

    await gifticonNFT.listForSale(serialNumber, parseEther("2"));
    const info = await gifticonNFT.getSerialInfo(serialNumber);

    expect(info.price).to.equal(parseEther("2"));
    expect(info.seller).to.equal(owner.address);
  });

  it("NFT를 시리얼 넘버 기반으로 구매할 수 있어야 한다", async function () {
    const tx = await gifticonNFT.mintBatchWithSerials(
      owner.address,
      tokenId,
      1,
      price,
      "Name",
      "Desc",
      "URI"
    );
    const [serialNumber] = await getSerialNumbersFromLogs(tx, gifticonNFT);

    await gifticonNFT.listForSale(serialNumber, price);
    await gifticonNFT.setApprovalForAll(user.address, true); // 승인 대상은 user

    const purchaseTx = await gifticonNFT
      .connect(user)
      .purchaseBySerial(serialNumber, { value: price });

    await expect(purchaseTx).to.changeEtherBalances(
      [user, owner],
      [parseEther("-1"), parseEther("1")]
    );
    expect(await gifticonNFT.getOwnerOfSerial(serialNumber)).to.equal(
      user.address
    );
  });

  it("NFT를 시리얼 넘버로 사용(redeem)할 수 있어야 한다", async function () {
    const tx = await gifticonNFT.mintBatchWithSerials(
      owner.address,
      tokenId,
      1,
      price,
      "Name",
      "Desc",
      "URI"
    );
    const [serialNumber] = await getSerialNumbersFromLogs(tx, gifticonNFT);

    await gifticonNFT.redeem(serialNumber);
    const info = await gifticonNFT.getSerialInfo(serialNumber);

    expect(info.isRedeemed).to.be.true;
  });

  it("NFT가 만료된 경우 사용(redeem)할 수 없어야 한다", async function () {
    const tx = await gifticonNFT.mintBatchWithSerials(
      owner.address,
      tokenId,
      1,
      price,
      "Name",
      "Desc",
      "URI"
    );
    const [serialNumber] = await getSerialNumbersFromLogs(tx, gifticonNFT);

    await ethers.provider.send("evm_increaseTime", [91 * 24 * 60 * 60]);
    await ethers.provider.send("evm_mine");

    await expect(gifticonNFT.redeem(serialNumber)).to.be.revertedWith(
      "Expired"
    );
  });

  it("NFT를 다른 사용자에게 선물할 수 있어야 한다", async function () {
    const tx = await gifticonNFT.mintBatchWithSerials(
      owner.address,
      tokenId,
      1,
      price,
      "Name",
      "Desc",
      "URI"
    );
    const [serialNumber] = await getSerialNumbersFromLogs(tx, gifticonNFT);

    await gifticonNFT.setApprovalForAll(otherUser.address, true); // self-approval ❌
    await gifticonNFT.giftNFT(otherUser.address, serialNumber);

    expect(await gifticonNFT.getOwnerOfSerial(serialNumber)).to.equal(
      otherUser.address
    );
  });

  it("판매 중인 NFT의 판매를 취소할 수 있어야 한다", async function () {
    const tx = await gifticonNFT.mintBatchWithSerials(
      owner.address,
      tokenId,
      1,
      price,
      "Name",
      "Desc",
      "URI"
    );
    const [serialNumber] = await getSerialNumbersFromLogs(tx, gifticonNFT);

    await gifticonNFT.listForSale(serialNumber, parseEther("2"));
    await gifticonNFT.cancelSale(serialNumber);

    const info = await gifticonNFT.getSerialInfo(serialNumber);
    expect(info.price).to.equal(0);
    expect(info.seller).to.equal(ethers.ZeroAddress); // v6 기준
  });
});
