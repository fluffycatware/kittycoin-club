pragma solidity ^0.4.18;

contract KittyFactory {

    /***********
        Events
    ************/
    // Event fires when a new kitty goes up for donation.
    // It can be receieved using web3 code like the following:
    // var event = KittyFactory.NewKitty(function(error, result)
    event NewKittyAdded(bytes5 kittyId, string name, uint traitsId);

    // Used to generate and store the different traits
    // for the kitties uploaded. This allows us to encode details
    // about the kitties in the contract as a way around
    // being able to use actual photos
    // uint equal to 10^16. use the modulus operator % 
    // to shorten an integer to 16 digits.
    uint traitDigits = 16;
    uint seedModulus = 10 ** traitDigits;

    //TODO decide if having the string name is too expensive
    // Kitty donation offer
    struct Kitty {
        // Allows the toggling on and off of donations
        bool donationsEnabled;
        // The address used to pay out donations. 80% goes
        // to foster address if it is included. with 20% to
        // trust address as a kick back to the orgs
        address fosterAddress;
        // Trust address of the charity or org that put up
        // the donation page for the kitty. 20% usually goes here
        // unless fosterAddress isn't specified, then 100% goes
        // to trust
        address trustAddress;
        // Traits about the cat are added here, this is info
        // like limb colors, size, gender, etc...
        uint kittyTraitSeed;
        // A cap on the total donations that can be made to a
        // kitty before the donations fail over to the trust.
        // This limits the amount a foster carer can get before
        // kickbacks are sent to the trusts
        uint donationCap;
    }

    // Public array of all KittyCoins
    Kitty[] public kitties;

    // Creates a kitty and returns is index in the kitties array
    function _createKitty(
        bool _enabled, 
        address _fosterAddr, 
        address _trustAddr, 
        uint _traitSeed, 
        uint _donationCap
        ) internal returns (uint) 
        {
        // 'id' is the index of the kitty in the array of kitties
        uint id = kitties.push(
            Kitty(_enabled, _fosterAddr, _trustAddr, _traitSeed, _donationCap)
            ) - 1;
        // Return the index of the newly created kitty
        return id;
    }
}