pragma solidity ^0.4.18;

import "./KittyFactory.sol";

/**
* @title DonationFactory
* @author Nathan Glover
* @notice Handles donations on kitties currently enabled for donations
*/
contract DonationFactory is KittyFactory {

    /* Events */
    event NewDonation(uint donationId, uint kittyId, uint donationAmount);

    struct Donation {
        uint kittyId;
        uint trustAmount;
        uint fosterAmount;
        address trustAddress;
        address fosterAddress;
    }

    // Public array of all Donations
    Donation[] public donations;

    /* Mappings */
    mapping (uint => address) public donationToDonator;
    mapping (address => uint) donatorDonationCount;

    /**
    * @notice Performs a donation based on the computed variables from the donator.
    * @param _kittyId The id of the kitty being donated to
    * @param _trustAmount The amount being donated to the trust
    * @param _fosterAmount The amount being donated to the foster carer
    * @param _trustAddress The wallet address of the trust
    * @param _fosterAddress The wallet address of the foster carer
    */
    function _donate(
        uint _kittyId, 
        uint _trustAmount, 
        uint _fosterAmount, 
        address _trustAddress, 
        address _fosterAddress) internal
        {
            //TODO Execute the transaction
            
            // 'id' is the index of the donation in the array of donations
            uint id = donations.push(
                Donation(_kittyId, _trustAmount, _fosterAmount, _trustAddress, _fosterAddress)
                ) - 1;
            // Reference the donation to the sender
            donationToDonator[id] = msg.sender;
            // increment the total number of kittcoins owned for the sender
            donatorDonationCount[msg.sender]++;
            //TODO Implement SafeMaths
            uint totalAmount = _trustAmount + _fosterAmount;
            // Return an event for the newly created donation
            NewDonation(id, _kittyId, totalAmount);
    }

    /**
    * @notice Performs a donation, computing the ratio of the funds
    * that should go to the trust and the foster carer. If the foster
    * carer has reached their limit for donations when the amount
    * goes to the trust.
    * @param _kittyId The id of the kitty being donated to
    * @param _amount The total amount being donated
    * @param _ratio The percentage that should go to the foster carer
    */
    function makeDonation(uint _kittyId, uint _amount, uint _ratio) public {
        // Confirm the ratio is a valid percentage equivilent
        require(_ratio <= 100 && _ratio >= 0);
        // Ensure that donations are available on the kitty
        require(kitties[_kittyId].donationsEnabled);

        //TODO Implement SafeMaths - This is awful
        uint donationTotal = _amount;
        uint fosterAmount = _amount * (_ratio / 100);
        uint fosterOverflow;
        if (fosterAmount > kitties[_kittyId].donationCap) {
            fosterOverflow = fosterAmount - kitties[_kittyId].donationCap;
            fosterAmount = fosterAmount - fosterOverflow;
        }
        uint trustAmount = donationTotal - fosterAmount + fosterOverflow;
        // Validate the maths worked correctly
        assert(_amount == (trustAmount + fosterAmount));

        // Make the donation
        _donate(
            _kittyId, 
            trustAmount, 
            fosterAmount, 
            kitties[_kittyId].trustAddress, 
            kitties[_kittyId].fosterAddress
            );
    }
    
    /**
    * @notice Performs a donation, computing the ratio of the funds
    * that should go to the trust and the foster carer. If the foster
    * carer has reached their limit for donations when the amount
    * goes to the trust.
    * @param _donator Donator address
    * @return an array of donation identifiers
    */
    function getDonationsByDonator(address _donator) external view returns(uint[]) {
        uint[] memory result = new uint[](donatorDonationCount[_donator]);
        uint counter = 0;
        for (uint i = 0; i < donations.length; i++) {
            if (donationToDonator[i] == _donator) {
                result[counter] = i;
                counter++;
            }
        }
        return result;
    }
}