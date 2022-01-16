// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract CafecitoToken is ERC721, ERC721Enumerable, ERC721URIStorage, AccessControl {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;
    bytes32 public constant MINTER_BURNER_ROLE = keccak256("MINTER_BURNER_ROLE");

    // IPFSHash => uint8
    mapping(string => uint8) hashes;

    event Mint(address to, string metadata, uint tokenId);
    event Burn(uint tokenId); // Add owner's address?

    constructor() ERC721("CafecitoSwap", "CAFE") {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(MINTER_BURNER_ROLE, msg.sender);
    }

    function mintCafecito(address user, string memory _hash, string memory metadata)
        public
        onlyRole(MINTER_BURNER_ROLE)
    {
        require(hashes[_hash] != 1, "Hash already in use");
        hashes[_hash] = 1;
        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();
        _safeMint(user, tokenId);
        _setTokenURI(tokenId, metadata);
        emit Mint(user, metadata, tokenId);
    }

    function burnCafecito(uint tokenId)
        public
        onlyRole(MINTER_BURNER_ROLE)
    {
        _burn(tokenId);
        _tokenIdCounter.decrement();
        emit Burn(tokenId);
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function getTokenCount() public view returns(uint){
        return _tokenIdCounter.current();
    }
}