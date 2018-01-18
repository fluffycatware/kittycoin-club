pragma solidity ^0.4.18;

import "./KittyCoinFactory.sol";


contract KittyCoinHandler is KittyCoinFactory {

    // Retrieves an array containing all KittyCoin's owned
    // by an address. This function makes use of contract memory
    // while it populates the array of results.
    function getKittyCoinsByOwner(address _owner) external view returns(uint[]) {
        uint[] memory result = new uint[](ownerKittyCoinCount[_owner]);
        uint counter = 0;
        for (uint i = 0; i < kittyCoins.length; i++) {
            if (kittyCoinToOwner[i] == _owner) {
                result[counter] = i;
                counter++;
            }
        }
        return result;
    }
}