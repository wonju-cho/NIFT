// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GifticonNFT is ERC1155, Ownable(msg.sender) {
    uint256 private _tokenIdCounter = 1;
    
    mapping(uint256 => mapping(address => bool)) public redeemed;
    mapping(uint256 => mapping(address => uint256)) public prices;
    mapping(uint256 => mapping(address => uint256)) public listedAmount;

    event Minted(address indexed owner, uint256 indexed tokenId, uint256 amount);
    event PriceUpdated(uint256 indexed tokenId, uint256 newPrice);
    event ListedForSale(uint256 indexed tokenId, address indexed seller, uint256 amount, uint256 price);
    event NFTPurchased(address indexed buyer, uint256 indexed tokenId, address indexed seller, uint256 amount, uint256 price);
    event Redeemed(address indexed owner, uint256 indexed tokenId);

    constructor() ERC1155("ipfs://bafkreifj53t5ciradsorecuagrasftt4pfercqvjuhyrhks2piwokho2iy") {}

    function mint(address account, uint256 price, uint256 amount) public onlyOwner {
        uint256 newTokenId = _tokenIdCounter;
        _mint(account, newTokenId, amount, "");
        prices[newTokenId][account] = price;
        emit Minted(account, newTokenId, amount);
        _tokenIdCounter++;
    }

    function listForSale(uint256 tokenId, uint256 amount, uint256 price) public {
        require(balanceOf(msg.sender, tokenId) >= amount, "You do not own enough NFT");
        require(price > 0, "Price must be greater than zero");

        listedAmount[tokenId][msg.sender] += amount;
        prices[tokenId][msg.sender] = price;

        emit ListedForSale(tokenId, msg.sender, amount, price);
    }

    function purchaseNFT(uint256 tokenId, address seller, uint256 amount) public payable {
        require(listedAmount[tokenId][seller] >= amount, "Not enough NFTs listed for sale");
        require(msg.value >= prices[tokenId][seller] * amount, "Insufficient payment");

        listedAmount[tokenId][seller] -= amount;
        safeTransferFrom(seller, msg.sender, tokenId, amount, "");

        if (listedAmount[tokenId][seller] == 0) {
            delete prices[tokenId][seller];
        }

        // 판매자에게 금액 전송
        payable(seller).transfer(msg.value);

        emit NFTPurchased(msg.sender, tokenId, seller, amount, prices[tokenId][seller]);
    }

    function getPrice(uint256 tokenId, address seller) public view returns (uint256) {
        return prices[tokenId][seller];
    }

    function getListedAmount(uint256 tokenId, address seller) public view returns (uint256) {
        return listedAmount[tokenId][seller];
    }

    function redeem(uint256 tokenId) public {
        require(balanceOf(msg.sender, tokenId) > 0, "You do not own this NFT");
        require(!redeemed[tokenId][msg.sender], "This NFT has already been redeemed");

        redeemed[tokenId][msg.sender] = true;
        emit Redeemed(msg.sender, tokenId);
    }

    function isRedeemed(uint256 tokenId, address owner) public view returns (bool) {
        return redeemed[tokenId][owner];
    }

    function getCurrentTokenId() public view returns (uint256) {
        return _tokenIdCounter - 1;
    }
}
