pragma solidity ^0.4.18;

import "./ownership/Ownable.sol";

/**
 * @title KittyFactory 
 * @author Nathan Glover
 * @notice manages the creation and modification of kittys that are up for donation
 */
contract KittyFactory is Ownable {

    /* Events */
    event NewKitty(uint kittyId, uint traitsId);

    // Used to generate and store the different traits
    // for the kitties uploaded. This allows us to encode details
    // about the kitties in the contract as a way around
    // being able to use actual photos
    // uint equal to 10^16. use the modulus operator % 
    // to shorten an integer to 16 digits.
    uint traitDigits = 16;
    uint seedModulus = 10 ** traitDigits;

    //TODO decide if having the string name is too expensive
    struct Kitty {
        // Allows the toggling on and off of donations
        bool donationsEnabled;
        // The address used to pay out donations. 80% goes
        // to foster address if it is included. with 20% to
        // trust address as a kick back to the orgs
        address trustAddress;
        // Traits about the cat are added here, this is info
        // like limb colors, size, gender, etc...
        address fosterAddress;
        // Trust address of the charity or org that put up
        // the donation page for the kitty. 20% usually goes here
        // unless fosterAddress isn't specified, then 100% goes
        // to trust
        uint kittyTraitSeed;
        // A cap on the total donations that can be made to a
        // kitty before the donations fail over to the trust.
        // This limits the amount a foster carer can get before
        // kickbacks are sent to the trusts
        uint donationCap;
    }

    // Public array of all Kitties
    Kitty[] public kitties;

    /* Mappings */
    mapping (uint => address) public kittyToTrust;
    mapping (address => uint) trustKittyCount;

    //TODO Confirm that this is called by a trust
    /**
    * @notice Creates a new kitty which goes up for donation
    * @param _enabled Toggles the donation status on this kitty
    * @param _trustAddr The wallet address of the trust
    * @param _fosterAddr The wallet address of the foster carer
    * @param _traitSeed Unique traits for this kitty
    * @param _donationCap The maximum amount that the carer can receive
    */
    function _createKitty(
        bool _enabled, 
        address _trustAddr, 
        address _fosterAddr, 
        uint _traitSeed, 
        uint _donationCap
        ) internal
        {   
        // 'id' is the index of the kitty in the array of kitties
        uint id = kitties.push(
            Kitty(_enabled, _trustAddr, _fosterAddr, _traitSeed, _donationCap)
            ) - 1;
        // Reference the donation to the sender
        kittyToTrust[id] = msg.sender;
        // increment the total number of kittcoins owned for the sender
        trustKittyCount[msg.sender]++;
        // Return an event for the newly created kitty
        NewKitty(id, _traitSeed);
    }
}