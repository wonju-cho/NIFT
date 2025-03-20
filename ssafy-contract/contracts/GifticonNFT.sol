// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title GifticonNFT
 * @dev ERC-1155 기반의 NFT 기프티콘 컨트랙트 (개별 토큰 관리 및 시리얼 넘버 포함, 구조체 사용)
 */
contract GifticonNFT is ERC1155, Ownable(msg.sender) {
    uint256 private _tokenIdCounter = 1; // 토큰 ID 자동 증가 변수

    // 토큰 정보를 담는 구조체
    struct TokenInfo {
        uint256 serialNumber;
        uint256 price;
        address seller;
        uint256 expirationDate;
    }

    mapping(uint256 => TokenInfo) private _tokenInfos; // 토큰 ID별 정보 저장
    mapping(uint256 => bool) public redeemed; // NFT 사용 여부 저장 (tokenId => isRedeemed)
    mapping(uint256 => uint256) private _serialNumberToTokenId; // 시리얼 넘버로 토큰 ID 찾기

    // 이벤트 정의
    event Minted(address indexed owner, uint256 indexed tokenId, uint256 serialNumber);
    event PriceUpdated(uint256 indexed tokenId, uint256 newPrice);
    event ListedForSale(uint256 indexed tokenId, uint256 serialNumber, address indexed seller, uint256 price);
    event NFTPurchased(address indexed buyer, uint256 indexed tokenId, address indexed seller, uint256 price);
    event Redeemed(address indexed owner, uint256 indexed tokenId);
    event SaleCancelled(uint256 indexed tokenId, address indexed seller);
    event Gifted(address indexed sender, address indexed recipient, uint256 indexed tokenId);

    /**
     * @dev 생성자: 기본 URI 설정
     */
    constructor() ERC1155("ipfs://bafkreifj53t5ciradsorecuagrasftt4pfercqvjuhyrhks2piwokho2iy") {}

    /**
     * @dev 새로운 NFT 민팅 (관리자만 실행 가능)
     * @param account 수령할 계정
     * @param price 초기 판매 가격
     * @param serialNumber 발행할 시리얼 넘버
     */
    function mint(address account, uint256 price, uint256 serialNumber) public onlyOwner {
        uint256 newTokenId = _tokenIdCounter;
        require(_tokenInfos[newTokenId].serialNumber == 0, "Token ID already exists"); // 토큰 ID 중복 방지
        require(_isSerialNumberUnique(serialNumber), "Serial number already exists"); // 시리얼 넘버 중복 방지

        _mint(account, newTokenId, 1, ""); // ERC-1155는 amount를 받아야 하므로 1로 설정
        _tokenInfos[newTokenId] = TokenInfo({
            serialNumber: serialNumber,
            price: price,
            seller: address(0),
            expirationDate: block.timestamp + (90 days) // 민팅 후 90일 후 만료 설정
        });
        _serialNumberToTokenId[serialNumber] = newTokenId;
        emit Minted(account, newTokenId, serialNumber);
        _tokenIdCounter++;
    }

    /**
     * @dev 시리얼 넘버의 유일성 검증
     */
    function _isSerialNumberUnique(uint256 serialNumber) internal view returns (bool) {
        return _serialNumberToTokenId[serialNumber] == 0;
    }

    /**
     * @dev NFT 판매 등록 (시리얼 넘버 사용)
     * @param serialNumber 판매 등록할 NFT의 시리얼 넘버
     * @param price 판매 가격
     */
    function listForSale(uint256 serialNumber, uint256 price) public {
        uint256 tokenId = _serialNumberToTokenId[serialNumber];
        require(tokenId > 0, "Serial number does not exist");
        require(balanceOf(msg.sender, tokenId) == 1, "You do not own this NFT or own more than one");
        require(price > 0, "Price must be greater than zero");
        require(_tokenInfos[tokenId].seller == address(0), "This NFT is already listed for sale by someone else"); // 이미 판매 등록된 경우 방지

        _tokenInfos[tokenId].seller = msg.sender;
        _tokenInfos[tokenId].price = price;

        emit ListedForSale(tokenId, serialNumber, msg.sender, price);
    }

    /**
     * @dev NFT 구매
     */
    function purchaseNFT(uint256 tokenId) public payable {
        require(_tokenInfos[tokenId].seller != address(0), "This NFT is not listed for sale");
        address currentSeller = _tokenInfos[tokenId].seller;
        uint256 currentPrice = _tokenInfos[tokenId].price;
        require(msg.value >= currentPrice, "Insufficient payment");

        delete _tokenInfos[tokenId].seller; // 판매자 정보 삭제 (구조체 전체를 삭제하거나 특정 필드만 초기화)
        delete _tokenInfos[tokenId].price; // 가격 정보 삭제

        safeTransferFrom(currentSeller, msg.sender, tokenId, 1, "");

        (bool success, ) = payable(currentSeller).call{value: msg.value}("");
        require(success, "Transfer failed");
        emit NFTPurchased(msg.sender, tokenId, currentSeller, currentPrice);
    }

    /**
     * @dev 특정 토큰 ID의 시리얼 넘버 조회
     */
    function getSerialNumber(uint256 tokenId) public view returns (uint256) {
        return _tokenInfos[tokenId].serialNumber;
    }

    /**
     * @dev NFT 판매 가격 조회
     */
    function getPrice(uint256 tokenId) public view returns (uint256) {
        return _tokenInfos[tokenId].price;
    }

    /**
     * @dev NFT 판매자 조회
     */
    function getSeller(uint256 tokenId) public view returns (address) {
        return _tokenInfos[tokenId].seller;
    }

    /**
     * @dev NFT 만료 날짜 조회
     */
    function getExpiration(uint256 tokenId) public view returns (uint256) {
        return _tokenInfos[tokenId].expirationDate;
    }

    /**
     * @dev NFT 만료 날짜 설정 (관리자만 가능)
     */
    function setExpiration(uint256 tokenId, uint256 timestamp) public onlyOwner {
        require(_tokenInfos[tokenId].expirationDate > 0, "Token does not exist");
        _tokenInfos[tokenId].expirationDate = timestamp;
    }

    /**
     * @dev NFT 사용 (한 번만 사용 가능)
     */
    function redeem(uint256 tokenId) public {
        require(balanceOf(msg.sender, tokenId) == 1, "You do not own this NFT");
        require(!redeemed[tokenId], "This NFT has already been redeemed");
        require(block.timestamp < _tokenInfos[tokenId].expirationDate, "This NFT has expired");

        redeemed[tokenId] = true;
        emit Redeemed(msg.sender, tokenId);
    }

    /**
     * @dev NFT 사용 여부 확인
     */
    function isRedeemed(uint256 tokenId) public view returns (bool) {
        return redeemed[tokenId];
    }

    /**
     * @dev 현재 생성된 마지막 토큰 ID 반환
     */
    function getCurrentTokenId() public view returns (uint256) {
        return _tokenIdCounter - 1;
    }

    /**
     * @dev 특정 시리얼 넘버의 토큰 ID 조회
     */
    function getTokenIdBySerialNumber(uint256 serialNumber) public view returns (uint256) {
        return _serialNumberToTokenId[serialNumber];
    }

    /**
     * @dev NFT 판매 등록 취소
     */
    function cancelSale(uint256 tokenId) public {
        require(_tokenInfos[tokenId].seller == msg.sender, "You are not the seller of this NFT");
        delete _tokenInfos[tokenId].seller;
        delete _tokenInfos[tokenId].price;
        emit SaleCancelled(tokenId, msg.sender);
    }

    /**
     * @dev NFT 선물 기능
     */
    function giftNFT(address recipient, uint256 tokenId) public {
        require(balanceOf(msg.sender, tokenId) == 1, "Insufficient NFT balance");
        safeTransferFrom(msg.sender, recipient, tokenId, 1, "");
        emit Gifted(msg.sender, recipient, tokenId);
    }

    /**
     * @dev 토큰 URI 설정 (관리자만 가능)
     * @param uri 새로운 기본 URI
     */
    function setURI(string memory uri) public onlyOwner {
        _setURI(uri);
    }
}