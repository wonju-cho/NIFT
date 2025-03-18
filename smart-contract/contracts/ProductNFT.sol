// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ProductNFT is ERC1155, Ownable {
    uint256 public constant TOKEN_ID = 1;
    uint256 public price = 0.000001 ether;  // NFT 가격 (0.01 ETH)
    
    event BuyAttempt(address buyer, uint256 amount, uint256 sentValue, uint256 requiredValue);
    event TransferFailed(string reason);
    event DebugLog(string message, uint256 value);

    mapping(uint256 => uint256) public totalSupply;

    // ✅ `Ownable`의 생성자에 `msg.sender`를 전달해야 함
    constructor() ERC1155("ipfs://QmSWq6h6vxXcZq92hqnrGWzsKtt5gUfBhvWE1riuhWnDo7") Ownable(msg.sender) {}

    // NFT 민팅 (판매자만 가능)
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, TOKEN_ID, amount, "");
        totalSupply[TOKEN_ID] += amount;
    }
    
    function buyToken(uint256 amount) public payable {
        uint256 requiredETH = price * amount;
        emit BuyAttempt(msg.sender, amount, msg.value, requiredETH);

        if (msg.value < requiredETH) {
            emit DebugLog("ETH insufficient", msg.value);
        }
        require(msg.value >= requiredETH, "Insufficient ETH sent");

        uint256 ownerBalance = balanceOf(owner(), TOKEN_ID);
        emit DebugLog("Seller NFT balance", ownerBalance);

        if (ownerBalance < amount) {
            emit DebugLog("Seller has insufficient NFTs", ownerBalance);
        }
        require(ownerBalance >= amount, "Not enough tokens available");

        (bool success, ) = owner().call{value: msg.value}("");
        emit DebugLog("ETH transfer success", success ? 1 : 0);

        if (!success) {
            emit TransferFailed("ETH transfer failed");
        }
        require(success, "ETH transfer failed");

        _safeTransferFrom(owner(), msg.sender, TOKEN_ID, amount, "");
        totalSupply[TOKEN_ID] -= amount;
    }

    // 가격 변경 기능 (오직 컨트랙트 소유자만 변경 가능)
    function setPrice(uint256 newPrice) public onlyOwner {
        price = newPrice;
    }
}
