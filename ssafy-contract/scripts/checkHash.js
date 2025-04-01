const { default: Web3 } = require("web3");

const web3 = new Web3();

const sig = "GiftPending(address,uint256,uint256,string,address,uint256)";
const hash = web3.utils.keccak256(sig);

console.log("Event hash:", hash);
