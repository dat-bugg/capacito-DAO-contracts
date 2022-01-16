// SPDX-License-Identifier: MIT

pragma solidity ^0.8.6;

import "./CafecitoToken.sol";
import "./curve/CafecitoCurve.sol";

contract CafecitoSwap{

    CafecitoCurve public cafecitoCurve;
    CafecitoToken public cafecitoToken;
    uint256 public treasuryFunds; 
    uint256 public liquidity;



    constructor(CafecitoCurve _cafecitoCurve, CafecitoToken _cafecitoToken){
        cafecitoCurve = _cafecitoCurve;
        cafecitoToken = _cafecitoToken;

    }


    function mint(address user, string memory _hash, string memory metadata) public payable{

        //uint randNumber = randomNumber();
        uint256 tokenCount = cafecitoToken.getTokenCount();
        uint256 cost = cafecitoCurve.getCurrentCost(tokenCount+1);
        require(msg.value >= cost,"Not enough Ether");
        cafecitoToken.mintCafecito(user, _hash, metadata);

        liquidity+=cost*85/100;
        treasuryFunds+=cost*15/100;

    }


    function burn(uint tokenId) public{

        require(cafecitoToken.ownerOf(tokenId) == msg.sender,"User does not own token"); 

        uint256 tokenCount = cafecitoToken.getTokenCount();
        uint256 toTransfer = cafecitoCurve.getCurrentCost(tokenCount);

        toTransfer = toTransfer*85/100;

        cafecitoToken.burnCafecito(tokenId);

        (bool success, ) = msg.sender.call{value: toTransfer}("");
        require(success);

        liquidity-=toTransfer;


    }

    function randomNumber() internal view returns(uint){

        uint number = block.timestamp%999;

        return number;

    }


    




}