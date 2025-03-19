// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.0;

// import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";

// contract GifticonNFT is ERC1155, Ownable(msg.sender) {
//     uint256 private _tokenIdCounter = 1; // NFT ID 자동 증가
//     mapping(uint256 => mapping(address => uint256)) public tokenPrices; // 특정 토큰ID에 대한 개별 소유자의 가격
//     mapping(uint256 => uint256) public totalSupply; // 각 tokenId의 총 공급량
//     mapping(uint256 => bool) public redeemed; // NFT 사용 여부 관리

//     event Minted(address indexed owner, uint256 indexed tokenId, uint256 amount);
//     event PriceSet(address indexed owner, uint256 indexed tokenId, uint256 price);
//     event Bought(address indexed buyer, address indexed seller, uint256 indexed tokenId, uint256 amount, uint256 price);

//     constructor() ERC1155("ipfs://bafkreifj53t5ciradsorecuagrasftt4pfercqvjuhyrhks2piwokho2iy") {}

//     // ✅ NFT 민팅 (각 상품 A, B, C, D 민팅)
//     function mint(address account, uint256 amount, uint256 price) public onlyOwner {
//         uint256 newTokenId = _tokenIdCounter;
//         _mint(account, newTokenId, amount, "");
//         totalSupply[newTokenId] += amount;
//         tokenPrices[newTokenId][account] = price; // 초기 가격 설정
//         emit Minted(account, newTokenId, amount);
//         _tokenIdCounter++;
//     }

//     // ✅ 사용자가 자신이 가진 NFT의 가격을 설정 가능
//     function setPrice(uint256 tokenId, uint256 price) public {
//         require(balanceOf(msg.sender, tokenId) > 0, "You do not own this NFT");
//         tokenPrices[tokenId][msg.sender] = price;
//         emit PriceSet(msg.sender, tokenId, price);
//     }

//     // ✅ 특정 판매자로부터 NFT를 구매
//     function buyToken(uint256 tokenId, address seller, uint256 amount) public payable {
//         uint256 pricePerToken = tokenPrices[tokenId][seller]; // 특정 판매자의 가격
//         uint256 totalCost = pricePerToken * amount;

//         require(msg.value >= totalCost, "Insufficient ETH sent");
//         require(balanceOf(seller, tokenId) >= amount, "Seller does not have enough tokens");

//         // ETH 전송
//         (bool success, ) = payable(seller).call{value: msg.value}("");
//         require(success, "ETH transfer failed");

//         _safeTransferFrom(seller, msg.sender, tokenId, amount, "");
//         totalSupply[tokenId] -= amount;

//         emit Bought(msg.sender, seller, tokenId, amount, totalCost);
//     }

//     // ✅ 현재 발행된 Token ID 확인
//     function getCurrentTokenId() public view returns (uint256) {
//         return _tokenIdCounter - 1;
//     }
// }
