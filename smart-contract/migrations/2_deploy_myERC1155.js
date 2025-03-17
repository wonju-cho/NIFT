const MyERC1155 = artifacts.require("MyERC1155");

module.exports = function (deployer) {
  deployer.deploy(MyERC1155);
};
