pragma solidity ^0.4.18;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Donation.sol";

contract TestDonation {
    Donation donation = Donation(DeployedAddresses.Donation());

    // Testing the donate() function
    function testUserCanDonateToKitty() public {
        uint returnedId = donation.donate(3);

        uint expected = 3;

        Assert.equal(returnedId, expected, "Donation to kitty ID 3 should be recorded.");
    }

    // Testing retrieval of a single kitties donators
    function testGetDonatorsByKittyId() public {
        // Expected donator in this contract
        address expected = this;

        address donator = donation.donators(3);

        Assert.equal(donator, expected, "Donator to kitty ID 3 should be recorded.");
    }

    // Testing retrieval of all kitty donators
    function testGetDonatorsByKittyIdInArray() public {
        // Expected donator is this contract
        address expected = this;

        // Store adopters in memory rather than contract's storage
        address[16] memory donators = donation.getDonators();

        Assert.equal(donators[3], expected, "Donator of kitty ID 3 should be recorded");
    }
}