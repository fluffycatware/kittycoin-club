pragma solidity ^0.4.18;

import "./ownership/Ownable.sol";

contract KittyCoinFactory is Ownable {

    // Event fires when a new kitty coin is generated. It can be
    // Received using web3 code like the following:
    // var event = KittyCoinFactory.NewKittyCoin(function(error, result)
    event NewKittyCoin(uint kittyCoinId, string name, uint mindId);

    // Used to generate the different types of
    // KittyCoin. Both visually and statistically
    uint mintIdDigits = 16;
    uint mintIdModulus = 10 ** mintIdDigits;

    //TODO eventually instead of name, use the kitty donated to
    struct KittyCoin {
        string name;
        uint mintId;
    }

    // Public array of all KittyCoins
    KittyCoin[] public kittyCoins;

    mapping (uint => address) public kittyCoinToOwner;
    mapping (address => uint) ownerKittyCoinCount;

    // Internally managed function to generate the KittyCoins safely
    function _createKittyCoin(string _name, uint _mintId) internal {
        uint id = kittyCoins.push(KittyCoin(_name, _mintId)) - 1;
        kittyCoinToOwner[id] = msg.sender;
        ownerKittyCoinCount[msg.sender]++;
        NewKittyCoin(id, _name, _mintId);
    }

    // Generates the random minted ID based on an input string
    // This input string will likely be the unique ID of the kitty
    // That recieved the donation
    function _generateRandomMintId(string _str) private view returns (uint) {
        uint rand = uint(keccak256(_str));
        return rand * mintIdModulus;
    }
    
    // Public function that allows new-commers to generate their first
    // KittyCoin for free.
    function createRandomKittyCoin(string _name) public {
        require(ownerKittyCoinCount[msg.sender] == 0);
        uint randMintId = _generateRandomMintId(_name);
        randMintId = randMintId - randMintId % 100;
        _createKittyCoin(_name, randMintId);
    }
}