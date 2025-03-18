// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GifticonNFT is ERC1155, Ownable {
    struct Gifticon {
        string name;
        string description;
        string imageURL;
        uint256 expiryDate;
        bool isRedeemed;
    }

    mapping(uint256 => Gifticon) public gifticons;

    constructor() ERC1155("https://your-api.com/metadata/{id}.json") Ownable(msg.sender) {}

    // ✅ 기프티콘 NFT 발행 (JSON 데이터 이용)
    function mint(
        address account,
        uint256 id,
        string memory name,
        string memory description,
        string memory imageURL,
        uint256 expiryDate
    ) public onlyOwner {
        require(gifticons[id].expiryDate == 0, "Token ID already exists");
        _mint(account, id, 1, ""); // 1개의 NFT 발행

        // 기프티콘 정보 저장
        gifticons[id] = Gifticon(name, description, imageURL, expiryDate, false);
    }

    // ✅ 특정 NFT 정보 조회
    function getGifticon(uint256 id) public view returns (Gifticon memory) {
        return gifticons[id];
    }
}
