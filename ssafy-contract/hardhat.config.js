require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  defaultNetwork: "ssafy",
  networks: {
    ssafy: {
      url: "https://rpc.ssafy-blockchain.com", // SSAFY 네트워크 RPC URL
      accounts: [process.env.PRIVATE_KEY], // Metamask Private Key
      chainId: 31221, // SSAFY 네트워크 Chain ID
      gas: "auto", // ✅ 자동 설정
      gasPrice: 0, // ✅ 기본 통화를 SSF로 사용하려면 gasPrice를 0으로 설정
    },
  },
  solidity: "0.8.20",
};
