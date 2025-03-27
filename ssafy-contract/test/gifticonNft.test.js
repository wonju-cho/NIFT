const { expect } = require("chai");
const { ethers } = require("hardhat");
const { parseUnits } = ethers;

// 🎯 GifticonNFT 스마트 컨트랙트 전체 테스트
describe("GifticonNFT Full Test", function () {
  let gifticonNFT, owner, user, other;
  let mockToken;
  const tokenId = 1;
  const price = parseUnits("10", 0);
  const uri =
    "ipfs://bafkreifj53t5ciradsorecuagrasftt4pfercqvjuhyrhks2piwokho2iy";

  async function mintAndGetSerial(amount = 1) {
    const tx = await gifticonNFT.mintBatchWithSerials(
      owner.address,
      tokenId,
      amount,
      price,
      "Name",
      "Desc",
      uri
    );
    const receipt = await tx.wait();
    const iface = gifticonNFT.interface;
    return receipt.logs
      .map((log) => {
        try {
          return iface.parseLog(log);
        } catch (_) {
          return null;
        }
      })
      .filter(Boolean)
      .map((log) => log.args.serialNumber)
      .slice(-amount);
  }

  beforeEach(async function () {
    [owner, user, other] = await ethers.getSigners();

    const MockSSF = await ethers.getContractFactory("MockERC20");
    mockToken = await MockSSF.deploy("SSF", "SSF", 0);
    await mockToken.waitForDeployment();
    await mockToken.mint(user.address, 1000);

    const GifticonNFT = await ethers.getContractFactory("GifticonNFT");
    gifticonNFT = await GifticonNFT.deploy(await mockToken.getAddress());
    await gifticonNFT.waitForDeployment();

    await gifticonNFT
      .connect(owner)
      .setApprovalForAll(await gifticonNFT.getAddress(), true);
  });

  it("민팅 후 시리얼 증가 및 메타데이터 확인", async () => {
    const serials = await mintAndGetSerial(2);
    expect(serials.length).to.equal(2);
    const info = await gifticonNFT.getTokenInfo(tokenId);
    expect(info.name).to.equal("Name");
  });

  it("판매 등록 및 중복 등록 실패", async () => {
    const [serial] = await mintAndGetSerial();
    await gifticonNFT.listForSale(serial, price);
    await expect(gifticonNFT.listForSale(serial, price)).to.be.reverted;
  });

  it("타인이 판매 등록 시도 시 실패", async () => {
    const [serial] = await mintAndGetSerial();
    await expect(
      gifticonNFT.connect(user).listForSale(serial, price)
    ).to.be.revertedWith("Not the owner");
  });

  it("SSF 부족 시 구매 실패", async () => {
    const [serial] = await mintAndGetSerial();
    await gifticonNFT.listForSale(serial, price);
    await mockToken.connect(user).approve(await gifticonNFT.getAddress(), 5);
    await expect(
      gifticonNFT.connect(user).purchaseBySerial(serial)
    ).to.be.revertedWith("ERC20: insufficient allowance");
  });

  it("정상 구매 후 소유자 이전", async () => {
    const [serial] = await mintAndGetSerial();

    await gifticonNFT.listForSale(serial, price);

    await mockToken
      .connect(user)
      .approve(await gifticonNFT.getAddress(), price);

    const allowance = await mockToken.allowance(
      user.address,
      await gifticonNFT.getAddress()
    );
    expect(allowance).to.equal(price);

    await gifticonNFT.connect(user).purchaseBySerial(serial);
    const ownerNow = await gifticonNFT.getOwnerOfSerial(serial);

    expect(ownerNow).to.equal(user.address);
  });

  it("판매 취소 후 소유자 복원", async () => {
    const [serial] = await mintAndGetSerial();
    await gifticonNFT.listForSale(serial, price);
    await gifticonNFT.cancelSale(serial);
    const info = await gifticonNFT.getSerialInfo(serial);
    expect(info.owner).to.equal(owner.address);
  });

  it("선물 기능 정상 동작", async () => {
    const [serial] = await mintAndGetSerial();
    await gifticonNFT.setApprovalForAll(await gifticonNFT.getAddress(), true);
    await gifticonNFT.giftNFT(other.address, serial);
    const newOwner = await gifticonNFT.getOwnerOfSerial(serial);
    expect(newOwner).to.equal(other.address);
  });

  it("판매 중인 NFT 선물 불가", async () => {
    const [serial] = await mintAndGetSerial();
    await gifticonNFT.listForSale(serial, price);
    await expect(gifticonNFT.giftNFT(other.address, serial)).to.be.revertedWith(
      "Cannot gift while listed for sale"
    );
  });

  it("만료된 NFT는 사용 불가", async () => {
    const [serial] = await mintAndGetSerial();
    await ethers.provider.send("evm_increaseTime", [91 * 24 * 60 * 60]);
    await ethers.provider.send("evm_mine");
    await expect(gifticonNFT.redeem(serial)).to.be.revertedWith("Expired");
  });

  it("조회 기능 정상 동작", async () => {
    const [serial] = await mintAndGetSerial();
    const serials = await gifticonNFT.getSerialsByOwner(owner.address);
    expect(serials.map((s) => s?.toString())).to.include(serial.toString());
  });
});
