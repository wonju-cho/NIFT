// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GifticonNFT is ERC1155, Ownable(msg.sender) {
    uint256 private _tokenIdCounter = 1; // NFT ID 자동 증가
    mapping(uint256 => bool) public redeemed; // NFT 사용 여부 관리

    // ✅ 민팅 이벤트 (Token ID 확인 가능)
    event Minted(address indexed owner, uint256 indexed tokenId, uint256 amount);

    constructor() ERC1155("ipfs://bafkreifj53t5ciradsorecuagrasftt4pfercqvjuhyrhks2piwokho2iy") {}

    // ✅ NFT 민팅 함수 (기프티콘 발급)
    function mint(address account, uint256 amount) public onlyOwner {
        uint256 newTokenId = 4; // 현재 Token ID 할당
        _mint(account, newTokenId, amount, "");
        emit Minted(account, newTokenId, amount); // ✅ 이벤트 발생 (Token ID 확인 가능)
        _tokenIdCounter++; // 다음 Token ID 증가
    }

    // ✅ NFT 사용 처리 (기프티콘 사용)
    function redeem(uint256 tokenId) public {
        require(balanceOf(msg.sender, tokenId) > 0, "You do not own this NFT");
        require(!redeemed[tokenId], "This NFT has already been redeemed");
        redeemed[tokenId] = true;
    }

    // ✅ 사용 여부 확인
    function isRedeemed(uint256 tokenId) public view returns (bool) {
        return redeemed[tokenId];
    }

    // ✅ 현재 발행된 Token ID 확인 함수
    function getCurrentTokenId() public view returns (uint256) {
        return _tokenIdCounter - 1; // 마지막으로 발행된 Token ID 반환
    }
}
