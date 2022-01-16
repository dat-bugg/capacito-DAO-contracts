// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "../libraries/PiecewiseLogic.sol";

contract CalculateCost {

    /// @notice Fetches the cost of n tokens
    /// @dev 
    /// @param curve g
    /// @param start g
    /// @param nth g
    /// @param initCost g
    function costOfN(
        int[] memory curve,
        uint start,
        uint nth,
        uint initCost
    )
        public
        pure
        returns (uint)
    {
        int res = PiecewiseLogic.evaluateFunction(curve, start, nth);
        require(res >= 0, "Error: Cost cannot be negative");
        uint cost = uint(res) * initCost;
        return cost;        
    }

}