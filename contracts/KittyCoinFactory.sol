pragma solidity ^0.4.18;

import "./ownership/Ownable.sol";


contract KittyCoinFactory is Ownable {

    /***********
        Events
    ************/
    // Event fires when a new kitty coin is generated. It can be
    // Received using web3 code like the following:
    // var event = KittyCoinFactory.NewKittyCoin(function(error, result)
    event NewKittyCoin(uint kittyCoinId, string name, uint coinSeed);

    // Used to generate the different types of KittyCoin. 
    // uint equal to 10^16. use the modulus operator % 
    // to shorten an integer to 16 digits.
    uint coinDigits = 16;
    uint seedModulus = 10 ** coinDigits;

    //TODO eventually instead of name, use the kitty donated to
    struct KittyCoin {
        string name;
        uint coinSeed;
    }

    // Public array of all KittyCoins
    KittyCoin[] public kittyCoins;

    mapping (uint => address) public kittyCoinToOwner;
    mapping (address => uint) ownerKittyCoinCount;

    // Internally managed function to generate the KittyCoins safely
    function _createKittyCoin(string _name, uint _seed) internal {
        // 'id' is the index of the kittycoin in the array of kittycoins
        uint id = kittyCoins.push(KittyCoin(_name, _seed)) - 1;
        // assign the owner of the kittycoin to the sender
        kittyCoinToOwner[id] = msg.sender;
        // increment the total number of kittcoins owned for the sender
        ownerKittyCoinCount[msg.sender]++;
        // Send an event alerting the KittyCoins creation
        NewKittyCoin(id, _name, _seed);
    }

    //TODO decide if I want to allow an inital purchase of not
    // Generates the random seed based on an input string
    // This input string will be unique to the kitty coin
    // to give the a different visual output
    function _generateRandomSeed(string _str) private view returns (uint) {
        // First gets the Keccak hash of our input string.
        // for example: Gracie
        // 7104ce976fa04688b15c4b9a9a675060a6add290ccb2a5e2fa8f4b4f98ea748f
        uint rand = uint(keccak256(_str));
        // Then multiplies our hash by the seedModulus. In this case
        // its 16 * 10 = 160
        // 7104ce976fa04688b15c4b9a9a675060a6add290ccb2a5e2fa8f4b4f98ea748f * 160
        return rand * seedModulus;
    }
    
    // Public function that allows new-commers to generate their first
    // KittyCoin for free.
    function createRandomKittyCoin(string _name) public {
        // Confirm that the owner doesn't have any kittycoins
        require(ownerKittyCoinCount[msg.sender] == 0);
        // the seed for the kittycoin is generated based on the input string
        uint randSeed = _generateRandomSeed(_name);
        // The cat is created by a private function
        _createKittyCoin(_name, randSeed);
    }
}