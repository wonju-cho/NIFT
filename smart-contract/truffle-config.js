require("dotenv").config();
const HDWalletProvider = require("@truffle/hdwallet-provider");

module.exports = {
  networks: {
    // sepolia: {
    //   provider: () =>
    //     new HDWalletProvider(
    //       process.env.PRIVATE_KEY,
    //       "https://sepolia.infura.io/v3/22df496150fb47ecaa202a17cbac9289"
    //     ),
    //   network_id: 11155111, // ✅ Sepolia 네트워크 ID 추가
    //   gas: 5000,
    //   gasPrice: 10000,
    //   confirmations: 2,
    //   timeoutBlocks: 200,
    //   skipDryRun: true,
    //   pollingInterval: 10000, // ⏳ 10초 간격으로 블록 확인
    // },
    ssafy_network: {
      // ✅ 네트워크 키 추가
      provider: () =>
        new HDWalletProvider(
          process.env.PRIVATE_KEY,
          "https://rpc.ssafy-blockchain.com"
        ),
      network_id: 31221,
      gas: 8000000, // 🔥 가스 리밋을 증가 (기존보다 더 높게)
      gasPrice: 1000000000, // 🔥 가스 가격 (1 Gwei)
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
      pollingInterval: 10000, // ⏳ 10초 간격으로 블록 확인
    },
  },

  compilers: {
    solc: {
      version: "0.8.20",
    },
  },
};
