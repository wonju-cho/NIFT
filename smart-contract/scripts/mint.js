const MyERC1155 = artifacts.require("MyERC1155");

module.exports = async function (callback) {
  try {
    let instance = await MyERC1155.deployed();
    let accounts = await web3.eth.getAccounts();

    console.log("Minting NFT...");
    await instance.mint(accounts[1], 1, 10, { from: accounts[0] });

    let balance = await instance.balanceOf(accounts[1], 1);
    console.log(`NFT ID 1 Balance: ${balance.toString()}`);

    callback();
  } catch (error) {
    console.error(error);
    callback(error);
  }
};
