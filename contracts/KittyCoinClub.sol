pragma solidity ^0.4.18;

import "./KittyCoinFactory.sol";

/**
 * @title KittyCoinClub
 * @dev KittyCoinClub contract is the main input to the this DApp,
 * it controls the supply of KittyCoins in circulation and
 * other utilities perdinant to the contract a a whole
 */
contract KittyCoinClub is KittyCoinFactory {

    address owner;

    string public name = "KittyCoinClub";
    string public symbol = "🐱"; // unicode cat symbol
    uint8 public decimals = 0;
    
    // Coin supply details
    uint256 public totalSupply = 25600;
    uint16 public remainingKittyCoins = 25600 - 256; // there will only ever be 25,000 cats
    uint16 public remainingFounderCoins = 256; // there can only be a maximum of 256 founder coins
    uint16 public donationIndex = 0;

    // gets set with the immediately preceding blockhash when 
    // the contract is activated to prevent "premining"
    bytes32 public searchSeed = 0x0;
    
    /**
    * @dev Contructor for the KittCoinClub contract
    */
    function KittyCoinClub() payable public {
        owner = msg.sender;
    }

    /**
    * @dev Retrieves an array containing all KittyCoin's owned
    * by an address. This function makes use of contract memory
    * while it populates the array of results.
    * @param _owner The address of the owner to find kittycoins for
    */
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