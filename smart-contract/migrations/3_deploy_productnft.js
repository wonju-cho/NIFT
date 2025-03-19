const ProductNFT = artifacts.require("ProductNFT");

module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(ProductNFT);
  const instance = await ProductNFT.deployed();

  // 배포한 계정에 100개의 토큰 민팅
  await instance.mint(accounts[0], 10);
  console.log(`100 tokens minted to ${accounts[0]}`);
};
