pragma solidity ^0.4.18;

contract Donation {

    address[16] public donators;

    // Donating to a kitty
    function donate(uint kittyId) public returns (uint) {
        require(kittyId >= 0 && kittyId <= 15);

        donators[kittyId] = msg.sender;

        return kittyId;
    }

    // Retrieving the donators
    function getDonators() public view returns (address[16]) {
        return donators;
    }
}