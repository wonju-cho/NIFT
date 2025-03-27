const { expect } = require("chai");
const { ethers } = require("hardhat");
const { utils } = ethers;
const { parseUnits } = ethers;

describe("GifticonNFT Full Coverage Test", function () {
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

    await gifticonNFT.setApprovalForAll(await gifticonNFT.getAddress(), true);
  });

  it("민팅 후 시리얼 증가 및 메타데이터 확인", async () => {
    const serials = await mintAndGetSerial(2);
    expect(serials.length).to.equal(2);
    const info = await gifticonNFT.getTokenInfo(tokenId);
    expect(info.name).to.equal("Name");
  });

  it("기존 tokenId로 mint 시 totalSupply 증가", async () => {
    await mintAndGetSerial(1);
    const before = await gifticonNFT.getTokenInfo(tokenId);
    await mintAndGetSerial(1);
    const after = await gifticonNFT.getTokenInfo(tokenId);
    expect(Number(after.totalSupply)).to.equal(Number(before.totalSupply) + 1);
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

  it("판매자가 아니면 판매 취소 불가", async () => {
    const [serial] = await mintAndGetSerial();
    await gifticonNFT.listForSale(serial, price);
    await expect(
      gifticonNFT.connect(user).cancelSale(serial)
    ).to.be.revertedWith("Not the seller");
  });

  it("redeem: expired (block.timestamp >= expirationDate)", async () => {
    const [serial] = await mintAndGetSerial();

    // 만료 시점까지 시간 증가
    await ethers.provider.send("evm_increaseTime", [91 * 24 * 60 * 60]); // 91일
    await ethers.provider.send("evm_mine");

    await expect(gifticonNFT.redeem(serial)).to.be.revertedWith("Expired");
  });

  it("정상적으로 기프티콘 사용 가능", async () => {
    const [serial] = await mintAndGetSerial();
    const info = await gifticonNFT.getSerialInfo(serial);
    const now = (await ethers.provider.getBlock("latest")).timestamp;

    expect(Number(info.expirationDate)).to.be.greaterThan(now);

    await gifticonNFT.redeem(serial);

    const updated = await gifticonNFT.getSerialInfo(serial);
    expect(updated.redeemed).to.be.true;
  });

  it("판매 중인 NFT는 사용할 수 없음", async () => {
    const [serial] = await mintAndGetSerial();
    await gifticonNFT.listForSale(serial, price);
    await expect(gifticonNFT.redeem(serial)).to.be.revertedWith(
      "cannot use that is already list to sale"
    );
  });

  it("선물 상태에서는 사용 불가", async () => {
    const [serial] = await mintAndGetSerial();
    await gifticonNFT.giftToFriend(serial, user.address);
    await expect(gifticonNFT.redeem(serial)).to.be.revertedWith(
      "Pending because it is send to someone"
    );
  });

  it("이미 선물 상태이면 giftToFriend 실패", async () => {
    const [serial] = await mintAndGetSerial();
    await gifticonNFT.giftToFriend(serial, user.address);
    await expect(
      gifticonNFT.giftToFriend(serial, user.address)
    ).to.be.revertedWith("Already in gift state");
  });

  it("선물 대기 상태 등록 후 받는 사람이 선물 수령", async () => {
    const [serial] = await mintAndGetSerial();
    await gifticonNFT.giftToFriend(serial, user.address);
    await ethers.provider.send("evm_increaseTime", [60]);
    await ethers.provider.send("evm_mine");
    await gifticonNFT.connect(user).obtainGift(owner.address, serial);
    const newOwner = await gifticonNFT.getOwnerOfSerial(serial);
    expect(newOwner).to.equal(user.address);
  });

  it("선물 수령 기한 초과 시 실패", async () => {
    const [serial] = await mintAndGetSerial();
    await gifticonNFT.giftToFriend(serial, user.address);
    await ethers.provider.send("evm_increaseTime", [6 * 24 * 60 * 60]);
    await ethers.provider.send("evm_mine");
    await expect(
      gifticonNFT.connect(user).obtainGift(owner.address, serial)
    ).to.be.revertedWith("Gift state is Expired");
  });

  it("받는이가 아닌 사람이 선물 수령 시도 시 실패", async () => {
    const [serial] = await mintAndGetSerial();
    await gifticonNFT.giftToFriend(serial, user.address);
    await expect(
      gifticonNFT.connect(other).obtainGift(owner.address, serial)
    ).to.be.revertedWith("Not the intended recipient");
  });

  it("만료된 NFT는 사용 불가", async () => {
    const [serial] = await mintAndGetSerial();
    await ethers.provider.send("evm_increaseTime", [91 * 24 * 60 * 60]);
    await ethers.provider.send("evm_mine");
    await expect(gifticonNFT.redeem(serial)).to.be.revertedWith("Expired");
  });

  it("reclaim: notify 후 일정 시간이 지나야 회수 가능", async () => {
    const [serial] = await mintAndGetSerial();

    // 선물 및 수령으로 원래 owner와 다르게 만들기
    await gifticonNFT.giftToFriend(serial, user.address);
    await gifticonNFT.connect(user).obtainGift(owner.address, serial);

    // 만료 시점까지 시간 증가
    await ethers.provider.send("evm_increaseTime", [91 * 24 * 60 * 60]);
    await ethers.provider.send("evm_mine");

    // notifyReclaim 호출 (회수 알림)
    await gifticonNFT.notifyReclaim(serial);

    // 대기 시간 3일 미만에서는 회수 실패
    await ethers.provider.send("evm_increaseTime", [2 * 24 * 60 * 60]); // 2일
    await ethers.provider.send("evm_mine");

    await expect(gifticonNFT.reclaimExpiredNFT(serial)).to.be.revertedWith(
      "Waiting period not over"
    );

    // 대기 시간 이후에는 회수 성공
    await ethers.provider.send("evm_increaseTime", [2 * 24 * 60 * 60]); // 추가 2일
    await ethers.provider.send("evm_mine");

    await gifticonNFT.reclaimExpiredNFT(serial);

    const ownerNow = await gifticonNFT.getOwnerOfSerial(serial);
    expect(ownerNow).to.equal(owner.address);
  });

  it("notifyReclaim: 중복 호출 시 실패", async () => {
    const [serial] = await mintAndGetSerial();

    await gifticonNFT.giftToFriend(serial, user.address);
    await gifticonNFT.connect(user).obtainGift(owner.address, serial);

    await ethers.provider.send("evm_increaseTime", [91 * 24 * 60 * 60]);
    await ethers.provider.send("evm_mine");

    await gifticonNFT.notifyReclaim(serial);
    await expect(gifticonNFT.notifyReclaim(serial)).to.be.revertedWith(
      "Already notified"
    );
  });

  it("notifyReclaim: ReclaimNotice 이벤트 발생 확인", async () => {
    const [serial] = await mintAndGetSerial();

    await gifticonNFT.giftToFriend(serial, user.address);
    await gifticonNFT.connect(user).obtainGift(owner.address, serial);

    await ethers.provider.send("evm_increaseTime", [91 * 24 * 60 * 60]);
    await ethers.provider.send("evm_mine");

    const tx = await gifticonNFT.notifyReclaim(serial);
    const receipt = await tx.wait();

    const event = receipt.logs
      .map((log) => {
        try {
          return gifticonNFT.interface.parseLog(log);
        } catch (_) {
          return null;
        }
      })
      .find((e) => e?.name === "ReclaimNotice");

    expect(event).to.exist;
    expect(event.args.serialNumber.toString()).to.equal(serial.toString());
  });

  it("reclaim 실패 - 이미 원 소유자인 경우", async () => {
    const [serial] = await mintAndGetSerial();

    await ethers.provider.send("evm_increaseTime", [91 * 24 * 60 * 60]);
    await ethers.provider.send("evm_mine");

    await gifticonNFT.notifyReclaim(serial);

    // ⏱️ notify 후 3일 경과시키기
    await ethers.provider.send("evm_increaseTime", [3 * 24 * 60 * 60]);
    await ethers.provider.send("evm_mine");

    await expect(gifticonNFT.reclaimExpiredNFT(serial)).to.be.revertedWith(
      "Already original owner"
    );
  });

  it("reclaim 실패 - 사용된 NFT", async () => {
    const [serial] = await mintAndGetSerial();
    await gifticonNFT.redeem(serial);

    await ethers.provider.send("evm_increaseTime", [91 * 24 * 60 * 60]);
    await ethers.provider.send("evm_mine");

    await gifticonNFT.notifyReclaim(serial);

    // ⏱️ notify 후 3일 경과시키기
    await ethers.provider.send("evm_increaseTime", [3 * 24 * 60 * 60]);
    await ethers.provider.send("evm_mine");

    await expect(gifticonNFT.reclaimExpiredNFT(serial)).to.be.revertedWith(
      "Already redeemed"
    );
  });

  it("setURI는 owner만 가능", async () => {
    await gifticonNFT.setURI("newURI");
    const uri = await gifticonNFT.uri(0);
    expect(uri).to.equal("newURI");
    await expect(
      gifticonNFT.connect(user).setURI("failURI")
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("조회 기능 정상 동작", async () => {
    const [serial] = await mintAndGetSerial();
    const serials = await gifticonNFT.getSerialsByOwner(owner.address);
    expect(serials.map((s) => s?.toString())).to.include(serial.toString());

    const tokenIdFromSerial = await gifticonNFT.getTokenIdBySerial(serial);
    expect(tokenIdFromSerial).to.equal(tokenId);
  });

  it("serial/tokenId mismatch 시 전송 실패", async () => {
    const [serial] = await mintAndGetSerial();
    const wrongTokenId = ethers.getBigInt(tokenId) + 1n;

    await expect(
      gifticonNFT.safeTransferFrom(
        owner.address,
        user.address,
        wrongTokenId,
        1,
        ethers.AbiCoder.defaultAbiCoder().encode(
          ["uint256", "uint256"],
          [serial.toString(), "0"]
        )
      )
    ).to.be.revertedWith("Serial/tokenId mismatch");
  });

  it("mint 시 amount가 0이면 실패", async () => {
    await expect(
      gifticonNFT.mintBatchWithSerials(
        owner.address,
        tokenId,
        0,
        price,
        "Name",
        "Desc",
        uri
      )
    ).to.be.revertedWith("Amount must be > 0");
  });

  it("판매자가 isApprovedForAll 설정 안 했을 경우 구매 실패", async () => {
    const [serial] = await mintAndGetSerial();
    await gifticonNFT.listForSale(serial, price);

    await gifticonNFT.setApprovalForAll(await gifticonNFT.getAddress(), false); // 승인 취소

    await mockToken
      .connect(user)
      .approve(await gifticonNFT.getAddress(), price);
    await expect(
      gifticonNFT.connect(user).purchaseBySerial(serial)
    ).to.be.revertedWith("Contract not approved by seller");
  });

  it("_beforeTokenTransfer 실패: data.length < 32", async () => {
    const [serial] = await mintAndGetSerial();
    const tokenId = await gifticonNFT.getTokenIdBySerial(serial);

    await expect(
      gifticonNFT.safeTransferFrom(
        owner.address,
        user.address,
        tokenId,
        1,
        "0x" // 빈 data
      )
    ).to.be.revertedWith("Not enough data");
  });

  it("_beforeTokenTransfer 실패: 이미 redeemed된 경우", async () => {
    const [serial] = await mintAndGetSerial();
    await gifticonNFT.redeem(serial);
    const tokenId = await gifticonNFT.getTokenIdBySerial(serial);

    await expect(
      gifticonNFT.safeTransferFrom(
        owner.address,
        user.address,
        tokenId,
        1,
        ethers.AbiCoder.defaultAbiCoder().encode(["uint256"], [serial])
      )
    ).to.be.revertedWith("Cannot transfer: already redeemed");
  });

  it("_beforeTokenTransfer 실패: 선물 중인데 판매 등록된 경우", async () => {
    const [serial] = await mintAndGetSerial();
    await gifticonNFT.giftToFriend(serial, user.address);

    // 내부적으로 판매자 등록
    const info = await gifticonNFT.getSerialInfo(serial);
    const tokenId = await gifticonNFT.getTokenIdBySerial(serial);
    await gifticonNFT.listForSale(serial, price);

    await expect(
      gifticonNFT.safeTransferFrom(
        owner.address,
        user.address,
        tokenId,
        1,
        ethers.AbiCoder.defaultAbiCoder().encode(
          ["uint256", "uint256"],
          [serial.toString(), "1"] // TransferMode.Gift
        )
      )
    ).to.be.revertedWith("Cannot gift: listed for sale");
  });

  it("권한 없는 사용자가 mint 시도 시 실패", async () => {
    await expect(
      gifticonNFT
        .connect(user)
        .mintBatchWithSerials(
          user.address,
          tokenId,
          1,
          price,
          "Name",
          "Desc",
          uri
        )
    ).to.be.revertedWith("Unauthorized transfer");
  });

  it("정상적으로 선물 상태 → 선물 수령 → 내부 전송 발생", async () => {
    const [serial] = await mintAndGetSerial();
    await gifticonNFT.giftToFriend(serial, user.address);
    await gifticonNFT.connect(user).obtainGift(owner.address, serial);
    const newOwner = await gifticonNFT.getOwnerOfSerial(serial);
    expect(newOwner).to.equal(user.address);
  });

  it("TransferMode.Gift로 safeTransferFrom 정상 동작 (obtainGift 경유)", async () => {
    const [serial] = await mintAndGetSerial();
    await gifticonNFT.giftToFriend(serial, user.address);

    // 시간 살짝 증가 (optional)
    await ethers.provider.send("evm_increaseTime", [100]);
    await ethers.provider.send("evm_mine");

    await gifticonNFT.connect(user).obtainGift(owner.address, serial);
    const newOwner = await gifticonNFT.getOwnerOfSerial(serial);
    expect(newOwner).to.equal(user.address);
  });

  it("supportsInterface는 올바르게 동작", async () => {
    const iface1 = "0xd9b67a26"; // ERC1155 interfaceId
    const iface2 = "0x0e89341c"; // ERC1155Receiver interfaceId
    const result1 = await gifticonNFT.supportsInterface(iface1);
    const result2 = await gifticonNFT.supportsInterface(iface2);
    expect(result1).to.be.true;
    expect(result2).to.be.true;
  });
});
