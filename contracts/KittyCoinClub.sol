pragma solidity ^0.4.18;

import "./KittyCoinFactory.sol";

/**
 * @title KittyCoinClub
 * @author Nathan Glover
 * @notice KittyCoinClub contract is the main input to the this DApp, it controls the 
 * supply of KittyCoins in circulation and other utilities perdinant to the contract a a whole
 */
contract KittyCoinClub is KittyCoinFactory {

    /* Contract owner */
    address owner;

    string public name = "KittyCoinClub"; // Name for display purposes
    string public symbol = "🐱"; // unicode cat symbol for display purposes
    uint8 public decimals = 0; // Amount of decimals for display purposes
    
    /* Coin supply details */
    uint256 public totalSupply = 25600;
    uint16 public remainingKittyCoins = 25600 - 256; // there will only ever be 25,000 cats
    uint16 public remainingFounderCoins = 256; // there can only be a maximum of 256 founder coins

    // gets set with the immediately preceding blockhash when 
    // the contract is activated to prevent "premining"
    bytes32 public searchSeed = 0x0;
    
    /**
    * @notice Contructor for the KittCoinClub contract
    */
    function KittyCoinClub() payable public {
        owner = msg.sender;
        assert((remainingKittyCoins + remainingFounderCoins) == totalSupply);
    }

    /**
    * @notice Retrieves an array containing all KittyCoin's owned
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