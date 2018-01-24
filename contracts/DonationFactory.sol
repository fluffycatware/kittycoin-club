pragma solidity ^0.4.18;


contract DonationFactory {

    /* Events */
    event NewDonation(uint donationId, uint kittyId, uint donationAmount);

    struct Donation {
        uint kittyId;
        uint trustAmount;
        uint fosterAmount;
        address trustAddress;
        address fosterAddress;
    }

    Donation[] public donations;

    mapping (uint => address) public donationToDonator;
    mapping (address => uint) donatorDonationCount;

    /**
    * @dev Performs a donation based on the computed variables
    * from the donator.
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
        address _fosterAddress) internal returns (uint) 
        {
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
    * @dev Performs a donation, computing the ratio of the funds
    * that should go to the trust and the foster carer. If the foster
    * carer has reached their limit for donations when the amount
    * goes to the trust.
    * @param _kittyId The id of the kitty being donated to
    * @param _amount The total amount being donated
    * @param _ratio The percentage that should go to the foster carer
    */
    function makeDonation(uint _kittyId, uint _amount, uint _ratio) {

    }

    // Retrieving the donators
    function getDonators() public view returns (address[16]) {
        return donators;
    }
    
    /**
    * @dev Performs a donation, computing the ratio of the funds
    * that should go to the trust and the foster carer. If the foster
    * carer has reached their limit for donations when the amount
    * goes to the trust.
    * @param _donator Donator address
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