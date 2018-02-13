pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import "zeppelin-solidity/contracts/math/SafeMath.sol";


/// @title KittyCoinClub
/// @author Nathan Glover
/// @notice KittyCoinClub contract is the main input to the this DApp, it controls the supply of KittyCoins in circulation and other utilities perdinant to the contract a a whole
contract KittyCoinClub is Ownable {

    /* Libraries */
    using SafeMath for uint256;

    /* Contract owner */
    address owner;

    /*
      _______    _                _____       _        _ _     
     |__   __|  | |              |  __ \     | |      (_) |    
        | | ___ | | _____ _ __   | |  | | ___| |_ __ _ _| |___ 
        | |/ _ \| |/ / _ \ '_ \  | |  | |/ _ \ __/ _` | | / __|
        | | (_) |   <  __/ | | | | |__| |  __/ || (_| | | \__ \
        |_|\___/|_|\_\___|_| |_| |_____/ \___|\__\__,_|_|_|___/
    */
    string public name = "KittyCoinClub"; // Name for display purposes
    string public symbol = "🐱"; // unicode cat symbol for display purposes
    uint8 public decimals = 0; // Amount of decimals for display purposes
    uint256 public totalSupply = 25600;
    uint16 public remainingKittyCoins = 25600 - 256; // there will only ever be 25,000 cats
    uint16 public remainingFounderCoins = 256; // there can only be a maximum of 256 founder coins
    
    /*
     _____ _                   _       
    / ____| |                 | |      
   | (___ | |_ _ __ _   _  ___| |_ ___ 
    \___ \| __| '__| | | |/ __| __/ __|
    ____) | |_| |  | |_| | (__| |_\__ \
   |_____/ \__|_|   \__,_|\___|\__|___/
    */
    struct KittyCoin {
        uint256 kittyId;
        uint256 donationId;
        uint coinSeed;
    }

    struct Donation {
        uint256 kittyId;
        address trustAddress;
        address fosterAddress;
        uint256 trustAmount;
        uint256 fosterAmount;
    }

    struct Kitty {
        bool donationsEnabled;
        address trustAddress;
        address fosterAddress;
        bytes5 kittyTraitSeed;
        uint256 donationCap;
    }

    struct Trust {
        bool trustEnabled;
        address trustAddress;
    }

    /*
    _____        _                                            
    |  __ \      | |            /\                             
    | |  | | __ _| |_ __ _     /  \   _ __ _ __ __ _ _   _ ___ 
    | |  | |/ _` | __/ _` |   / /\ \ | '__| '__/ _` | | | / __|
    | |__| | (_| | || (_| |  / ____ \| |  | | | (_| | |_| \__ \
    |_____/ \__,_|\__\__,_| /_/    \_\_|  |_|  \__,_|\__, |___/
                                                    __/ |    
                                                    |___/     
    */
    KittyCoin[] public kittyCoins;
    Donation[] public donations;
    Kitty[] public kitties;
    Trust[] public trusts;

    /*
     __  __                   _                 
    |  \/  |                 (_)                
    | \  / | __ _ _ __  _ __  _ _ __   __ _ ___ 
    | |\/| |/ _` | '_ \| '_ \| | '_ \ / _` / __|
    | |  | | (_| | |_) | |_) | | | | | (_| \__ \
    |_|  |_|\__,_| .__/| .__/|_|_| |_|\__, |___/
                | |   | |             __/ |    
                |_|   |_|            |___/     
    */
    mapping (uint256 => address) public kittyCoinToOwner;
    mapping (address => uint) public kittyCoinCount;

    mapping (uint256 => address) public donationToDonator;
    mapping (address => uint) public donationCount;

    mapping (uint256 => address) public kittyToTrust;
    mapping (address => uint) public kittyCount;

    mapping (uint256 => address) public trustIdToAddress;
    mapping (address => bool) public trusted;

    mapping (address => uint256) public pendingWithdrawals; // ETH pending for address

    /*
     ______               _       
    |  ____|             | |      
    | |____   _____ _ __ | |_ ___ 
    |  __\ \ / / _ \ '_ \| __/ __|
    | |___\ V /  __/ | | | |_\__ \
    |______\_/ \___|_| |_|\__|___/
    */
    event NewKittyCoin(uint256 kittyCoinId, uint256 kittyId, uint256 donationId, uint coinSeed);
    event NewDonation(uint256 donationId, uint256 kittyId, uint256 trustAmount, uint256 fosterAmount, uint256 totalDonationAmount);
    event NewKitty(uint256 kittyId, bytes5 traitSeed);
    event NewTrust(uint256 trustId);
    event ChangedTrustAddress(uint256 trustId, address trustAddr);

    /*
     __  __           _ _  __ _               
    |  \/  |         | (_)/ _(_)              
    | \  / | ___   __| |_| |_ _  ___ _ __ ___ 
    | |\/| |/ _ \ / _` | |  _| |/ _ \ '__/ __|
    | |  | | (_) | (_| | | | | |  __/ |  \__ \
    |_|  |_|\___/ \__,_|_|_| |_|\___|_|  |___/
    */
    /// @notice Throws if called by any account that is a not a trust
    modifier onlyTrust() {
        require(trusted[msg.sender]);
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    /*
      _____                _                   _             
     / ____|              | |                 | |            
    | |     ___  _ __  ___| |_ _ __ _   _  ___| |_ ___  _ __ 
    | |    / _ \| '_ \/ __| __| '__| | | |/ __| __/ _ \| '__|
    | |___| (_) | | | \__ \ |_| |  | |_| | (__| || (_) | |   
     \_____\___/|_| |_|___/\__|_|   \__,_|\___|\__\___/|_|   
    */
    /// @notice Contructor for the KittCoinClub contract
    function KittyCoinClub() payable public {
        owner = msg.sender;
        assert((remainingKittyCoins + remainingFounderCoins) == totalSupply);
    }

    /*
    __          __   _ _      _     _    _      _                     
    \ \        / /  | | |    | |   | |  | |    | |                    
     \ \  /\  / /_ _| | | ___| |_  | |__| | ___| |_ __   ___ _ __ ___ 
      \ \/  \/ / _` | | |/ _ \ __| |  __  |/ _ \ | '_ \ / _ \ '__/ __|
       \  /\  / (_| | | |  __/ |_  | |  | |  __/ | |_) |  __/ |  \__ \
        \/  \/ \__,_|_|_|\___|\__| |_|  |_|\___|_| .__/ \___|_|  |___/
                                                | |
                                                |_|   
    */
    /// @notice Allows the withdrawal of any owed currency to a sender
    function withdraw() public {
        uint256 amount = pendingWithdrawals[msg.sender];
        pendingWithdrawals[msg.sender] = 0;
        msg.sender.transfer(amount);
    }

    /*
                                              _          _____      _   _                
        /\                                   | |        / ____|    | | | |               
       /  \   __ _  __ _ _ __ ___  __ _  __ _| |_ ___  | |  __  ___| |_| |_ ___ _ __ ___ 
      / /\ \ / _` |/ _` | '__/ _ \/ _` |/ _` | __/ _ \ | | |_ |/ _ \ __| __/ _ \ '__/ __|
     / ____ \ (_| | (_| | | |  __/ (_| | (_| | ||  __/ | |__| |  __/ |_| ||  __/ |  \__ \
    /_/    \_\__, |\__, |_|  \___|\__, |\__,_|\__\___|  \_____|\___|\__|\__\___|_|  |___/
            __/ | __/ |          __/ |                                                 
            |___/ |___/          |___/                                                  
    */
    /// @notice Retrieves KittyCoins owned by an address.
    /// @param _owner The address of the owner to find KittyCoins for
    /// @return an array containing KittyCoins
    function getKittyCoinsByOwner(address _owner) external view returns(uint256[]) {
        uint256[] memory result = new uint256[](kittyCoinCount[_owner]);
        uint256 counter = 0;
        for (uint256 i = 0; i < kittyCoins.length; i++) {
            if (kittyCoinToOwner[i] == _owner) {
                result[counter] = i;
                counter++;
            }
        }
        return result;
    }

    /// @notice Retrieves an array containing all Donations.
    /// @return an array of donations
    function getDonations() external view returns(uint256[]) {
        uint256[] memory result = new uint256[](donations.length);
        uint256 counter = 0;
        for (uint256 i = 0; i < donations.length; i++) {
            result[counter] = i;
            counter++;
        }
        return result;
    }

    /// @notice Retrieves an array containing all Kitties up for donation.
    /// @return an array of kitties that are up for donation
    function getKitties() external view returns(uint256[]) {
        uint256[] memory result = new uint[](kitties.length);
        uint256 counter = 0;
        for (uint256 i = 0; i < kitties.length; i++) {
            result[counter] = i;
            counter++;
        }
        return result;
    }

    /*
     _  ___ _   _          _____      _       
    | |/ (_) | | |        / ____|    (_)      
    | ' / _| |_| |_ _   _| |     ___  _ _ __  
    |  < | | __| __| | | | |    / _ \| | '_ \ 
    | . \| | |_| |_| |_| | |___| (_) | | | | |
    |_|\_\_|\__|\__|\__, |\_____\___/|_|_| |_|
                    __/ |                    
                    |___/                     
    */
    uint coinDigits = 16;
    uint coinSeedModulus = 10 ** coinDigits;

    /// @notice generate the KittyCoins safely
    /// @param _kittyId identifier of the kitty who recieved the donation for this coin
    /// @param _donationId donation identifier that is linked to this coin
    /// @param _seed the generated seed
    function _createKittyCoin(uint256 _kittyId, uint256 _donationId, uint256 _seed) internal {
        uint id = kittyCoins.push(KittyCoin(_kittyId, _donationId, _seed)) - 1;
        kittyCoinToOwner[id] = msg.sender;
        kittyCoinCount[msg.sender]++;
        NewKittyCoin(id, _kittyId, _donationId, _seed);
    }

    //TODO work out if changing this input parameter to a uint is bad
    /// @notice Generates the random seed based on an input string
    /// @param _kittyTraits input seed for the randomly generated coin
    /// @return a random seed
    function _generateRandomSeed(bytes5 _kittyTraits) private view returns (uint256) {
        uint256 rand = uint256(keccak256(_kittyTraits));
        return rand * coinSeedModulus;
    }
    
    /// @notice Generates a Kitty coin for a donation that has been made
    /// @param _donationId donation to be used to generate the coin
    function createRandomKittyCoin(uint256 _donationId) public {
        // Confirm that the owner doesn't have any kittycoins
        require(kittyCoinCount[msg.sender] == 0);
        uint kittyId = donations[_donationId].kittyId;
        bytes5 kittyTraitSeed = kitties[kittyId].kittyTraitSeed;
        // the seed for the kittycoin is generated based on the input string
        uint256 randSeed = _generateRandomSeed(kittyTraitSeed);
        // The cat is created by a private function
        _createKittyCoin(kittyId, _donationId, randSeed);
    }

    /*
     _____                    _   _             
    |  __ \                  | | (_)            
    | |  | | ___  _ __   __ _| |_ _  ___  _ __  
    | |  | |/ _ \| '_ \ / _` | __| |/ _ \| '_ \ 
    | |__| | (_) | | | | (_| | |_| | (_) | | | |
    |_____/ \___/|_| |_|\__,_|\__|_|\___/|_| |_|                                        
    */
    /// @notice Performs a donation based on the computed variables from the donator.
    /// @param _kittyId The id of the kitty being donated to
    /// @param _trustAmount The amount being donated to the trust
    /// @param _fosterAmount The amount being donated to the foster carer
    /// @param _trustAddress The wallet address of the trust
    /// @param _fosterAddress The wallet address of the foster carer
    function _donate(
        uint256 _kittyId, 
        uint256 _trustAmount, 
        uint256 _fosterAmount, 
        address _trustAddress, 
        address _fosterAddress) internal
        {

        uint256 id = donations.push(
            Donation(_kittyId, _trustAddress, _fosterAddress, _trustAmount, _fosterAmount)
            ) - 1;

        // Complete the transaction
        pendingWithdrawals[_trustAddress] = _trustAmount;
        pendingWithdrawals[_fosterAddress] = _fosterAmount;

        donationToDonator[id] = msg.sender;
        donationCount[msg.sender]++;

        // Safe Maths sum total
        uint256 totalAmount = SafeMath.add(_trustAmount, _fosterAmount);

        NewDonation(id, _kittyId, _trustAmount, _fosterAmount, totalAmount);
    }

    /// @notice Performs a donation, If the foster carer has reached their limit for donations when the amount goes to the trust.
    /// @param _kittyId The id of the kitty being donated to
    /// @param _trustAmount Amount that should go to the trust
    /// @param _fosterAmount Amount that should go to the foster carer
    function makeDonation(uint256 _kittyId, uint256 _trustAmount, uint256 _fosterAmount) payable public {
        require(msg.value > 0);
        require(kitties[_kittyId].donationsEnabled);
        require(SafeMath.add(_trustAmount, _fosterAmount) == msg.value);

        // Safe Maths donation
        uint256 donationTotal = msg.value;
        uint256 fosterOverflow;
        uint256 fosterAmount = _fosterAmount;
        if (_fosterAmount >= kitties[_kittyId].donationCap) {
            fosterOverflow = SafeMath.sub(_fosterAmount, kitties[_kittyId].donationCap);
            fosterAmount = SafeMath.sub(_fosterAmount, fosterOverflow);
        }
        uint256 trustAmount = SafeMath.sub(donationTotal, fosterAmount);
        // Validate the maths worked correctly
        assert(msg.value == SafeMath.add(trustAmount, fosterAmount));

        // Make the donation
        _donate(
            _kittyId, 
            trustAmount, 
            fosterAmount, 
            kitties[_kittyId].trustAddress, 
            kitties[_kittyId].fosterAddress
            );
    }
    
    /// @notice Performs a donation, computing the ratio of the funds that should go to the trust and the foster carer. If the foster carer has reached their limit for donations when the amount goes to the trust.
    /// @param _donator Donator address
    /// @return an array of donation identifiers
    function getDonationsByDonator(address _donator) external view returns(uint256[]) {
        uint[] memory result = new uint[](donationCount[_donator]);
        uint counter = 0;
        for (uint i = 0; i < donations.length; i++) {
            if (donationToDonator[i] == _donator) {
                result[counter] = i;
                counter++;
            }
        }
        return result;
    }

    /// @notice Gets a donation object based on its id
    /// @param _donationId The ID of the donation
    /// @return Contents of the Donation struct
    function getDonation(uint256 _donationId)
        external 
        view 
        returns(
        uint256 kittyId,
        address trustAddress,
        address fosterAddress,
        uint256 trustAmount,
        uint256 fosterAmount
    ) {
        Donation storage donation = donations[_donationId];
        kittyId = donation.kittyId;
        trustAddress = donation.trustAddress;
        fosterAddress = donation.fosterAddress;
        trustAmount = uint256(donation.trustAmount);
        fosterAmount = uint256(donation.fosterAmount);
    }

    /*
     _  ___ _   _         
    | |/ (_) | | |        
    | ' / _| |_| |_ _   _ 
    |  < | | __| __| | | |
    | . \| | |_| |_| |_| |
    |_|\_\_|\__|\__|\__, |
                     __/ |
                    |___/ 
    */
    /// @notice private function to create a new kitty which goes up for donation
    /// @param _enabled Toggles the donation status on this kitty
    /// @param _trustAddr The wallet address of the trust
    /// @param _fosterAddr The wallet address of the foster carer
    /// @param _traitSeed Unique traits for this kitty
    /// @param _donationCap The maximum amount that the carer can receive
    function _createKitty(
        bool _enabled, 
        address _trustAddr, 
        address _fosterAddr, 
        bytes5 _traitSeed, 
        uint256 _donationCap
        ) internal
        {   
            
        uint256 id = kitties.push(
            Kitty(_enabled, _trustAddr, _fosterAddr, _traitSeed, _donationCap)
            ) - 1;

        kittyToTrust[id] = msg.sender;
        kittyCount[msg.sender]++;
        NewKitty(id, _traitSeed);
    }

    /// @notice Creates a new kitty which goes up for donation
    /// @param _fosterAddress The wallet address of the foster carer
    /// @param _traitSeed Unique traits for this kitty
    /// @param _donationCap The maximum amount that the carer can receive
    function createKitty(address _fosterAddress, bytes5 _traitSeed, uint256 _donationCap) onlyTrust public {
        require(_donationCap > 0);
        _createKitty(true, msg.sender, _fosterAddress, _traitSeed, _donationCap);
    }

    /// @notice Returns all the relevant information about a specific kitty.
    /// @param _kittyId The ID of the kitty of interest.
    function getKitty(uint256 _kittyId)
        external
        view
        returns (
        bool isEnabled,
        address trustAddress,
        address fosterAddress,
        bytes5 traitSeed,
        uint256 donationCap
    ) {
        Kitty storage kitty = kitties[_kittyId];
        isEnabled = kitty.donationsEnabled;
        trustAddress = kitty.trustAddress;
        fosterAddress = kitty.fosterAddress;
        traitSeed = bytes5(kitty.kittyTraitSeed);
        donationCap = uint256(kitty.donationCap);
    }
    
    /*
      _______             _   
     |__   __|           | |  
        | |_ __ _   _ ___| |_ 
        | | '__| | | / __| __|
        | | |  | |_| \__ \ |_ 
        |_|_|   \__,_|___/\__|
    */
    /// @notice Private trust creation that is handled internally
    /// @param _enabled Is the trust enabled
    /// @param _trustAddr The address to link this trust to
    function _createTrust(bool _enabled, address _trustAddr) internal {
        uint256 id = trusts.push(Trust(_enabled, _trustAddr)) - 1;
        trustIdToAddress[id] = _trustAddr;
        trusted[_trustAddr] = _enabled;
        NewTrust(id);
    }

    /// @notice Allows the contract owner to add a new trust
    /// @param _trustAddr The address to link this trust to
    function createTrust(address _trustAddr) onlyOwner public {
        _createTrust(true, _trustAddr);
    }

    /// @notice Allows the contract owner to enable and disable trusts
    /// @param _id The id of the trust that should be toggled
    /// @param _enabled A boolean true or false, where true is to enable and false is to disable the trust
    function toggleTrust(uint256 _id, bool _enabled) onlyOwner public {
        trusts[_id].trustEnabled = _enabled;
        trusted[trusts[_id].trustAddress] = _enabled;
    }

    /// @notice Allows a trust to change their address
    /// @param _newTrustAddr The new trust address to be set
    function changeTrustAddress(uint256 _id, address _newTrustAddr) onlyTrust public {
        require(trusts[_id].trustAddress == msg.sender);
        trusts[_id].trustAddress = _newTrustAddr;
        trustIdToAddress[_id] = _newTrustAddr;
        //TODO replace this logic with something better
        trusted[_newTrustAddr] = true;
        trusted[msg.sender] = false;
        ChangedTrustAddress(_id, _newTrustAddr);
    }

    /// @notice Checks if a given address belongs to a trust
    /// @param _address is the address that needs to be checked
    /// @return a boolean defining if a given address belongs to a trust
    function isTrustAddress(address _address) public view returns (bool) {
        return trusted[_address];
    }
}