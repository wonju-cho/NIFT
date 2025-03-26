// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title GifticonETH
 * @dev ERC1155 구조에서 시리얼 넘버 단위 NFT를 관리하고, tokenId에 대한 메타 정보도 포함하는 스마트 컨트랙트
 */
contract GifticonETH is ERC1155, Ownable, ERC1155Holder, ReentrancyGuard {
    // ⚙️ 상태 변수
    // 시리얼 넘버 단위 개별 NFT에 대한 정보
    struct SerialInfo {
        uint256 price;              // 판매 가격 (ETH로 변경)
        address seller;             // 판매자 주소
        address owner;              // 현재 소유자 주소
        uint256 expirationDate;     // 만료일 (timestamp)
        bool redeemed;              // 사용 여부
        uint256 redeemedAt;         // 사용한 시간
    }

    // tokenId에 해당하는 메타 정보
    struct TokenInfo {
        string name;
        string description;
        uint256 totalSupply;
        string metadataURI;
    }

    // 시리얼 넘버 자동 증가용 변수 (100000번부터 시작)
    uint256 private _nextSerial = 100000;

    // 매핑
    mapping(uint256 => uint256) private _serialToTokenId; // 시리얼 넘버 → tokenId
    mapping(uint256 => SerialInfo) private _serialInfos;    // 시리얼 넘버 → 시리얼 정보
    mapping(uint256 => TokenInfo) private _tokenInfos;      // tokenId → 메타 정보
    mapping(address => bool) private _authorizedTransfers; // 안전한 전송을 위한 허용된 전송자

    // 📢 이벤트 선언
    event Minted(address indexed owner, uint256 indexed tokenId, uint256 serialNumber);
    event ListedForSale(uint256 indexed serialNumber, uint256 price, address indexed seller);
    event NFTPurchased(address indexed buyer, uint256 indexed serialNumber, uint256 price);
    event Redeemed(address indexed owner, uint256 indexed serialNumber);
    event CancelledSale(uint256 indexed serialNumber);
    event Gifted(address indexed sender, address indexed recipient, uint256 indexed serialNumber);
    event SerialOwnershipTransferred(uint256 indexed serialNumber, address indexed from, address indexed to);

    // 🏗️ 생성자
    constructor() ERC1155("ipfs://bafkreifj53t5ciradsorecuagrasftt4pfercqvjuhyrhks2piwokho2iy") Ownable() {}

    // 🛡️ 수정자
    modifier onlyAuthorizedTransfer() {
        require(_authorizedTransfers[msg.sender] || msg.sender == address(this), "Unauthorized transfer");
        _;
    }

    // 📞 외부/공개 함수

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC1155, ERC1155Receiver) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    /**
     * @dev NFT 여러 개를 민팅하면서 tokenId와 시리얼 정보를 등록하는 함수
     */
    function mintBatchWithSerials(
        address to,
        uint256 tokenId,
        uint256 amount,
        uint256 price,
        string calldata name,
        string calldata description,
        string calldata metadataURI
    ) public onlyOwner {
        require(amount > 0, "Amount must be > 0");

        // tokenId에 대한 메타 정보 저장
        _tokenInfos[tokenId] = TokenInfo({
            name: name,
            description: description,
            totalSupply: amount,
            metadataURI: metadataURI
        });

        // 실제 ERC1155 토큰 민팅
        _mint(to, tokenId, amount, "");

        // 각각에 대해 시리얼 정보 생성
        for (uint256 i = 0; i < amount; i++) {
            uint256 serial = _generateNextSerial();

            _serialToTokenId[serial] = tokenId;
            _serialInfos[serial] = SerialInfo({
                price: price,
                seller: address(0),
                owner: to,
                expirationDate: block.timestamp + 90 days,
                redeemed: false,
                redeemedAt: 0
            });

            emit Minted(to, tokenId, serial);
        }
    }

    // 특정 시리얼 넘버의 NFT를 판매 목록에 등록
    function listForSale(uint256 serialNumber, uint256 price) public {
        SerialInfo storage info = _serialInfos[serialNumber];
        require(info.owner == msg.sender, "Not the owner");
        require(!info.redeemed, "Already redeemed");
        require(price > 0, "Price must be > 0");

        uint256 tokenId = _serialToTokenId[serialNumber];

        // 소유자 → 컨트랙트로 NFT 전송
        _authorizedTransfers[msg.sender] = true;
        safeTransferFrom(msg.sender, address(this), tokenId, 1, "");
        _authorizedTransfers[msg.sender] = false;

        // 정보 업데이트
        info.price = price;
        info.seller = msg.sender;
        info.owner = address(this); // 소유자는 컨트랙트로 변경

        emit ListedForSale(serialNumber, price, msg.sender);
    }

    // 시리얼 넘버 기반으로 NFT 구매
    function purchaseBySerial(uint256 serialNumber) public payable nonReentrant {
        SerialInfo storage info = _serialInfos[serialNumber];
        require(info.seller != address(0), "Not listed");
        require(!info.redeemed, "Already redeemed");
        require(info.price > 0, "Price not set");

        uint256 tokenId = _serialToTokenId[serialNumber];
        address seller = info.seller;
        uint256 salePrice = info.price;  // 가격을 별도 변수로 저장

        require(balanceOf(address(this), tokenId) >= 1, "NFT not held by contract");

        // ETH 결제
        require(msg.value == salePrice, "Incorrect value sent");

        // 판매자에게 ETH 전송
        payable(seller).transfer(msg.value);

        // NFT 전송
        _safeTransferFrom(address(this), msg.sender, tokenId, 1, "");

        // 상태 업데이트
        info.owner = msg.sender;
        info.seller = address(0);
        info.price = 0;

        emit NFTPurchased(msg.sender, serialNumber, salePrice);
        emit SerialOwnershipTransferred(serialNumber, seller, msg.sender);
    }

    // 기프티콘 사용 처리
    function redeem(uint256 serialNumber) public {
        SerialInfo storage info = _serialInfos[serialNumber];
        require(info.owner == msg.sender, "Not owner");
        require(!info.redeemed, "Already redeemed");
        require(block.timestamp < info.expirationDate, "Expired");

        info.redeemed = true;
        info.redeemedAt = block.timestamp;

        emit Redeemed(msg.sender, serialNumber);
    }

    // 판매 취소 처리
    function cancelSale(uint256 serialNumber) public nonReentrant {
        SerialInfo storage info = _serialInfos[serialNumber];
        
        // 판매자 확인
        require(info.seller == msg.sender, "Not the seller");
        require(!info.redeemed, "Already redeemed");

        uint256 tokenId = _serialToTokenId[serialNumber];
        
        // 컨트랙트가 토큰을 보유하고 있는지 확인
        require(balanceOf(address(this), tokenId) >= 1, "Contract doesn't hold the NFT");

        // 내부 전송 전 상태 업데이트
        info.owner = msg.sender;
        info.price = 0;
        info.seller = address(0);

        // 토큰 전송
        _safeTransferFrom(address(this), msg.sender, tokenId, 1, "");

        emit CancelledSale(serialNumber);
    }

    // 다른 사용자에게 NFT 선물
    function giftNFT(address to, uint256 serialNumber) public nonReentrant {
        SerialInfo storage info = _serialInfos[serialNumber];
        
        // 판매 중인 NFT 선물 방지를 먼저 체크
        require(info.seller == address(0), "Cannot gift while listed for sale");
        
        // 소유권 및 사용 가능 상태 확인
        require(info.owner == msg.sender, "Not owner");
        require(!info.redeemed, "Already redeemed");

        uint256 tokenId = _serialToTokenId[serialNumber];

        // 상태 업데이트
        info.owner = to;
        info.seller = address(0);
        info.price = 0;

        // 안전한 전송
        _safeTransferFrom(msg.sender, to, tokenId, 1, "");

        emit SerialOwnershipTransferred(serialNumber, msg.sender, to);
        emit Gifted(msg.sender, to, serialNumber);
    }

    // 🔍 조회 함수들

    // 시리얼 넘버로부터 tokenId 조회
    function getTokenIdBySerial(uint256 serialNumber) public view returns (uint256) {
        return _serialToTokenId[serialNumber];
    }

    // 시리얼 넘버 소유자 조회
    function getOwnerOfSerial(uint256 serialNumber) public view returns (address) {
        return _serialInfos[serialNumber].owner;
    }

    // 시리얼 넘버 상세 정보 조회
    function getSerialInfo(uint256 serialNumber) public view returns (
        uint256 price,
        address seller,
        address owner,
        uint256 expirationDate,
        bool isRedeemed,
        uint256 redeemedAt
    ) {
        SerialInfo memory info = _serialInfos[serialNumber];
        return (
            info.price,
            info.seller,
            info.owner,
            info.expirationDate,
            info.redeemed,
            info.redeemedAt
        );
    }

    // tokenId 기반 메타 정보 조회
    function getTokenInfo(uint256 tokenId) public view returns (
        string memory name,
        string memory description,
        uint256 totalSupply,
        string memory metadataURI
    ) {
        TokenInfo memory info = _tokenInfos[tokenId];
        return (
            info.name,
            info.description,
            info.totalSupply,
            info.metadataURI
        );
    }

    // URI 변경 함수 (owner만 가능)
    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    // 특정 주소가 소유한 시리얼 넘버 목록 조회
    function getSerialsByOwner(address owner) public view returns (uint256[] memory) {
        uint256 totalSerials = _nextSerial - 100000;
        uint256[] memory temp = new uint256[](totalSerials);
        uint256 count = 0;

        for (uint256 serial = 100001; serial <= _nextSerial; serial++) {
            if (_serialInfos[serial].owner == owner) {
                temp[count] = serial;
                count++;
            }
        }

        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = temp[i];
        }

        return result;
    }

    // 🛠️ 내부 함수

    // 내부적으로 시리얼 넘버 생성
    function _generateNextSerial() internal returns (uint256) {
        _nextSerial += 1;
        return _nextSerial;
    }
}
