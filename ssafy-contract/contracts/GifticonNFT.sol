// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title GifticonNFT
 * @dev ERC1155 기반의 NFT 기프티콘 컨트랙트
 */
contract GifticonNFT is ERC1155, Ownable(msg.sender) {
    uint256 private _tokenIdCounter = 1; // 토큰 ID 자동 증가 변수
    
    mapping(uint256 => mapping(address => bool)) public redeemed; // NFT 사용 여부 저장
    mapping(uint256 => mapping(address => uint256)) public prices; // NFT 판매 가격 저장
    mapping(uint256 => mapping(address => uint256)) public listedAmount; // 판매 등록된 NFT 개수 저장
    mapping(uint256 => uint256) public expirationDates; // NFT 만료 날짜 저장

    // 이벤트 정의
    event Minted(address indexed owner, uint256 indexed tokenId, uint256 amount);
    event PriceUpdated(uint256 indexed tokenId, uint256 newPrice);
    event ListedForSale(uint256 indexed tokenId, address indexed seller, uint256 amount, uint256 price);
    event NFTPurchased(address indexed buyer, uint256 indexed tokenId, address indexed seller, uint256 amount, uint256 price);
    event Redeemed(address indexed owner, uint256 indexed tokenId);

    /**
     * @dev 생성자: 기본 URI 설정
     */
    constructor() ERC1155("ipfs://bafkreifj53t5ciradsorecuagrasftt4pfercqvjuhyrhks2piwokho2iy") {}

    /**
     * @dev 새로운 NFT 민팅 (관리자만 실행 가능)
     * @param account 수령할 계정
     * @param price 초기 판매 가격
     * @param amount 발행 수량
     */
    function mint(address account, uint256 price, uint256 amount) public onlyOwner {
        uint256 newTokenId = _tokenIdCounter;
        _mint(account, newTokenId, amount, "");
        prices[newTokenId][account] = price;
        expirationDates[newTokenId] = block.timestamp + (90 days); // 민팅 후 90일 후 만료 설정
        emit Minted(account, newTokenId, amount);
        _tokenIdCounter++;
    }

    /**
     * @dev NFT 판매 등록
     */
    function listForSale(uint256 tokenId, uint256 amount, uint256 price) public {
        require(balanceOf(msg.sender, tokenId) >= amount, "You do not own enough NFT");
        require(price > 0, "Price must be greater than zero");

        listedAmount[tokenId][msg.sender] += amount;
        prices[tokenId][msg.sender] = price;

        emit ListedForSale(tokenId, msg.sender, amount, price);
    }

    /**
     * @dev NFT 구매
     */
    function purchaseNFT(uint256 tokenId, address seller, uint256 amount) public payable {
        require(listedAmount[tokenId][seller] >= amount, "Not enough NFTs listed for sale");
        require(msg.value >= prices[tokenId][seller] * amount, "Insufficient payment");

        listedAmount[tokenId][seller] -= amount;
        safeTransferFrom(seller, msg.sender, tokenId, amount, "");

        if (listedAmount[tokenId][seller] == 0) {
            delete prices[tokenId][seller];
        }

        (bool success, ) = payable(seller).call{value: msg.value}("");
        require(success, "Transfer failed");
        emit NFTPurchased(msg.sender, tokenId, seller, amount, prices[tokenId][seller]);
    }

    /**
     * @dev NFT 판매 가격 조회
     */
    function getPrice(uint256 tokenId, address seller) public view returns (uint256) {
        return prices[tokenId][seller];
    }

    /**
     * @dev NFT 판매 등록 개수 조회
     */
    function getListedAmount(uint256 tokenId, address seller) public view returns (uint256) {
        return listedAmount[tokenId][seller];
    }

    /**
     * @dev NFT 만료 날짜 조회
     */
    function getExpiration(uint256 tokenId) public view returns (uint256) {
        return expirationDates[tokenId];
    }

    /**
     * @dev NFT 만료 날짜 설정 (관리자만 가능)
     */
    function setExpiration(uint256 tokenId, uint256 timestamp) public onlyOwner {
        require(expirationDates[tokenId] > 0, "Token does not exist");
        expirationDates[tokenId] = timestamp;
    }

    /**
     * @dev NFT 사용 (한 번만 사용 가능)
     */
    function redeem(uint256 tokenId) public {
        require(balanceOf(msg.sender, tokenId) > 0, "You do not own this NFT");
        require(!redeemed[tokenId][msg.sender], "This NFT has already been redeemed");
        require(block.timestamp < expirationDates[tokenId], "This NFT has expired");

        redeemed[tokenId][msg.sender] = true;
        emit Redeemed(msg.sender, tokenId);
    }

    /**
     * @dev NFT 사용 여부 확인
     */
    function isRedeemed(uint256 tokenId, address owner) public view returns (bool) {
        return redeemed[tokenId][owner];
    }

    /**
     * @dev 현재 생성된 마지막 토큰 ID 반환
     */
    function getCurrentTokenId() public view returns (uint256) {
        return _tokenIdCounter - 1;
    }

    /**
     * @dev NFT 판매 등록 취소
     */
    function cancelSale(uint256 tokenId) public {
        require(listedAmount[tokenId][msg.sender] > 0, "You have no NFTs listed for sale");
        listedAmount[tokenId][msg.sender] = 0;
        delete prices[tokenId][msg.sender];
    }

    /**
     * @dev NFT 선물 기능
     */
    function giftNFT(address recipient, uint256 tokenId, uint256 amount) public {
        require(balanceOf(msg.sender, tokenId) >= amount, "Insufficient NFT balance");
        safeTransferFrom(msg.sender, recipient, tokenId, amount, "");
    }
}
