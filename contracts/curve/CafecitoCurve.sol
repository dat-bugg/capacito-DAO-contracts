// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "./CalculateCost.sol";

contract CafecitoCurve is CalculateCost{

    uint public initCost;
    int[] public rftCurve;

    constructor(uint _initCost, int[] memory _rftCurve) {
        initCost = _initCost;
        rftCurve = _rftCurve;
    }

    /// @notice Fetches the curve array
    function getCurve() public view returns(int[] memory){
        return rftCurve;
    }  

    /// @notice Fetches the cost from start plus the amount of tokens
    /// @dev 
    /// @param start The beginning of the count
    /// @param amount The number of tokens to calculate cost
    function getCostAmount(uint start, uint amount) public view returns(uint){
        int[] memory curve = rftCurve;
        uint cost = costOfN(curve, start, amount, initCost);
        return cost;
    }

    /// @notice Fetches the current token cost calculation
    /// @dev 
    /// @param start The number of tokens already minted from the curve
    function getCurrentCost(uint start) public view returns(uint){
        return getCostAmount(start, 0);
    }

}