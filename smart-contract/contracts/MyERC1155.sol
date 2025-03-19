// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyERC1155 is ERC1155, Ownable {
    uint256 public constant ITEM1 = 1;
    uint256 public constant ITEM2 = 2;

    constructor() ERC1155("") Ownable(msg.sender) {}

    function mint(address account, uint256 id, uint256 amount) public onlyOwner {
        _mint(account, id, amount, "");
    }

    function mintBatch(address account, uint256[] memory ids, uint256[] memory amounts) public onlyOwner {
        _mintBatch(account, ids, amounts, "");
    }
}