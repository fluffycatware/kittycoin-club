pragma solidity 0.4.23;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import "zeppelin-solidity/contracts/math/SafeMath.sol";


/// @title Interface for contracts conforming to ERC-721: Non-Fungible Tokens
/// @author Dieter Shirley <dete@axiomzen.co> (https://github.com/dete)
contract ERC721 {
    // Required methods
    function totalSupply() public view returns (uint256 total);
    function balanceOf(address _owner) public view returns (uint256 balance);
    function ownerOf(uint256 _tokenId) external view returns (address owner);
    function approve(address _to, uint256 _tokenId) external;
    function transfer(address _to, uint256 _tokenId) external;
    function transferFrom(address _from, address _to, uint256 _tokenId) external;

    // Events
    event Transfer(address from, address to, uint256 tokenId);
    event Approval(address owner, address approved, uint256 tokenId);

    // Optional
    // function name() public view returns (string name);
    // function symbol() public view returns (string symbol);
    // function tokensOfOwner(address _owner) external view returns (uint256[] tokenIds);
    // function tokenMetadata(uint256 _tokenId, string _preferredTransport) public view returns (string infoUrl);

    // ERC-165 Compatibility (https://github.com/ethereum/EIPs/issues/165)
    function supportsInterface(bytes4 _interfaceID) external view returns (bool);
}


/// @title The external contract that is responsible for generating metadata for the kitties, 
/// it has one function that will return the data as bytes.
contract ERC721Metadata {
    /// @dev Given a token Id, returns a byte array that is supposed to be converted into string.
    function getMetadata(uint256 _tokenId, string) public pure returns (bytes32[4] buffer, uint256 count) {
        if (_tokenId == 1) {
            buffer[0] = "Hello World! :D";
            count = 15;
        } else if (_tokenId == 2) {
            buffer[0] = "I would definitely choose a medi";
            buffer[1] = "um length string.";
            count = 49;
        } else if (_tokenId == 3) {
            buffer[0] = "Lorem ipsum dolor sit amet, mi e";
            buffer[1] = "st accumsan dapibus augue lorem,";
            buffer[2] = " tristique vestibulum id, libero";
            buffer[3] = " suscipit varius sapien aliquam.";
            count = 128;
        }
    }
}


/// @title KittyCoinClub
/// @author Nathan Glover
/// @notice KittyCoinClub contract is the main input to the this DApp, it controls the supply of KittyCoins in circulation and other utilities perdinant to the contract a a whole
contract KittyCoinClub is Ownable, ERC721 {

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
    /// @notice Name and symbol of the non fungible token, as defined in ERC721.
    string public constant name = "KittyCoinClub";
    string public constant symbol = "KCC";

    // uint8 public decimals = 0; // Amount of decimals for display purposes
    // uint256 public totalSupply = 25600;
    // uint16 public remainingKittyCoins = 25600 - 256; // there will only ever be 25,000 cats
    // uint16 public remainingFounderCoins = 256; // there can only be a maximum of 256 founder coins

    // The contract that will return kitty metadata
    ERC721Metadata public erc721Metadata;

    bytes4 constant InterfaceSignature_ERC165 = bytes4(keccak256("supportsInterface(bytes4)"));
    bytes4 constant InterfaceSignature_ERC721 = bytes4(keccak256("name()")) ^ 
    bytes4(keccak256("symbol()")) ^ 
    bytes4(keccak256("totalSupply()")) ^ 
    bytes4(keccak256("balanceOf(address)")) ^ 
    bytes4(keccak256("ownerOf(uint256)")) ^ 
    bytes4(keccak256("approve(address,uint256)")) ^ 
    bytes4(keccak256("transfer(address,uint256)")) ^ 
    bytes4(keccak256("transferFrom(address,address,uint256)")) ^ 
    bytes4(keccak256("tokensOfOwner(address)")) ^ 
    bytes4(keccak256("tokenMetadata(uint256,string)"));
    
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
        uint256 donationAmount;
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
    KittyCoin[] kittyCoins;
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
    /// @dev A mapping from KittyCoin IDs to the address that owns them. All coins have
    ///  some valid owner address.
    mapping (uint256 => address) public kittyCoinToOwner;

    // @dev A mapping from owner address to count of KittyCoins that address owns.
    //  Used internally inside balanceOf() to resolve ownership count.
    mapping (address => uint256) public kittyCoinCount;

    /// @dev A mapping from KittyIDs to an address that has been approved to call
    ///  transferFrom(). Each Kitty can only have one approved address for transfer
    ///  at any time. A zero value means no approval is outstanding.
    mapping (uint256 => address) public kittyCoinToApproved;

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
    event NewKittyCoin(address _owner, uint256 kittyCoinId, uint256 kittyId, uint256 donationId, uint coinSeed);
    event NewDonation(uint256 donationId, uint256 kittyId, uint256 trustAmount, uint256 fosterAmount, uint256 totalDonationAmount);
    event NewKitty(uint256 kittyId, address trustAddress, address fosterAddress, bytes5 traitSeed, uint256 donationCap);
    event NewTrust(uint256 trustId);
    event ChangedTrustAddress(uint256 trustId, address trustAddr);

    /// @dev Transfer event as defined in current draft of ERC721. Emitted every time a kittycoin
    ///  ownership is assigned.
    event Transfer(address from, address to, uint256 tokenId);

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
    constructor() payable public {
        owner = msg.sender;
        //assert((remainingKittyCoins + remainingFounderCoins) == totalSupply);
    }

    /*
      _______    _              
     |__   __|  | |             
        | | ___ | | _____ _ __  
        | |/ _ \| |/ / _ \ '_ \ 
        | | (_) |   <  __/ | | |
        |_|\___/|_|\_\___|_| |_|
    */
    /// @dev Assigns ownership of a specific KittyCoin to an address.
    function _transfer(address _from, address _to, uint256 _tokenId) internal {
        // Since the number of kittycoins is capped to 2^32 we can't overflow this
        kittyCoinCount[_to]++;
        // transfer ownership
        kittyCoinToOwner[_tokenId] = _to;
        // When creating new kittens _from is 0x0, but we can't account that address.
        if (_from != address(0)) {
            kittyCoinCount[_from]--;
        }
        // Emit the transfer event.
        emit Transfer(_from, _to, _tokenId);
    }

    /// @notice Introspection interface as per ERC-165 (https://github.com/ethereum/EIPs/issues/165).
    ///  Returns true for any standardized interfaces implemented by this contract. We implement
    ///  ERC-165 (obviously!) and ERC-721.
    function supportsInterface(bytes4 _interfaceID) external view returns (bool) {
        // DEBUG ONLY
        //require((InterfaceSignature_ERC165 == 0x01ffc9a7) && (InterfaceSignature_ERC721 == 0x9a20483d));
        return ((_interfaceID == InterfaceSignature_ERC165) || (_interfaceID == InterfaceSignature_ERC721));
    }

    /// @dev Set the address of the sibling contract that tracks metadata.
    function setMetadataAddress(address _contractAddress) public onlyOwner {
        erc721Metadata = ERC721Metadata(_contractAddress);
    }

    // Internal utility functions: These functions all assume that their input arguments
    // are valid. We leave it to public methods to sanitize their inputs and follow
    // the required logic.

    /// @dev Checks if a given address is the current owner of a particular KittyCoin.
    /// @param _claimant the address we are validating against.
    /// @param _tokenId kittencoin id, only valid when > 0
    function _owns(address _claimant, uint256 _tokenId) internal view returns (bool) {
        return kittyCoinToOwner[_tokenId] == _claimant;
    }

    /// @dev Checks if a given address currently has transferApproval for a particular KittyCoin.
    /// @param _claimant the address we are confirming kittycoin is approved for.
    /// @param _tokenId kittycoin id, only valid when > 0
    function _approvedFor(address _claimant, uint256 _tokenId) internal view returns (bool) {
        return kittyCoinToApproved[_tokenId] == _claimant;
    }

    /// @dev Marks an address as being approved for transferFrom(), overwriting any previous
    ///  approval. Setting _approved to address(0) clears all transfer approval.
    ///  NOTE: _approve() does NOT send the Approval event. This is intentional because
    ///  _approve() and transferFrom() are used together for putting Kitties on auction, and
    ///  there is no value in spamming the log with Approval events in that case.
    function _approve(uint256 _tokenId, address _approved) internal {
        kittyCoinToApproved[_tokenId] = _approved;
    }

    /// @notice Returns the number of KittyCoins owned by a specific address.
    /// @param _owner The owner address to check.
    /// @dev Required for ERC-721 compliance
    function balanceOf(address _owner) public view returns (uint256 count) {
        return kittyCoinCount[_owner];
    }

    /// @notice Transfers a KittyCoin to another address. If transferring to a smart
    ///  contract be VERY CAREFUL to ensure that it is aware of ERC-721 (or
    ///  KittyCoin Club specifically) or your KittyCoin may be lost forever. Seriously.
    /// @param _to The address of the recipient, can be a user or contract.
    /// @param _tokenId The ID of the KittyCoin to transfer.
    /// @dev Required for ERC-721 compliance.
    function transfer(
        address _to,
        uint256 _tokenId
    )
        external
    {
        // Safety check to prevent against an unexpected 0x0 default.
        require(_to != address(0));
        // Disallow transfers to this contract to prevent accidental misuse.
        // The contract should never own any kittycoins (except maybe very briefly
        // at the start of the contract deploy).
        require(_to != address(this));

        // You can only send your own kittycoin.
        require(_owns(msg.sender, _tokenId));

        // Reassign ownership, clear pending approvals, emit Transfer event.
        _transfer(msg.sender, _to, _tokenId);
    }

    /// @notice Grant another address the right to transfer a specific KittyCoin via
    ///  transferFrom(). This is the preferred flow for transfering NFTs to contracts.
    /// @param _to The address to be granted transfer approval. Pass address(0) to
    ///  clear all approvals.
    /// @param _tokenId The ID of the KittyCoin that can be transferred if this call succeeds.
    /// @dev Required for ERC-721 compliance.
    function approve(
        address _to,
        uint256 _tokenId
    )
        external
    {
        // Only an owner can grant transfer approval.
        require(_owns(msg.sender, _tokenId));

        // Register the approval (replacing any previous approval).
        _approve(_tokenId, _to);

        // Emit approval event.
        emit Approval(msg.sender, _to, _tokenId);
    }

    /// @notice Transfer a KittyCoin owned by another address, for which the calling address
    ///  has previously been granted transfer approval by the owner.
    /// @param _from The address that owns the KittyCoin to be transfered.
    /// @param _to The address that should take ownership of the KittyCoin. Can be any address,
    ///  including the caller.
    /// @param _tokenId The ID of the KittyCoin to be transferred.
    /// @dev Required for ERC-721 compliance.
    function transferFrom(
        address _from,
        address _to,
        uint256 _tokenId
    )
        external
    {
        // Safety check to prevent against an unexpected 0x0 default.
        require(_to != address(0));
        // Disallow transfers to this contract to prevent accidental misuse.
        // The contract should never own any kittycoins (except maybe very briefly
        // at the start of the contract deploy).
        require(_to != address(this));
        // Check for approval and valid ownership
        require(_approvedFor(msg.sender, _tokenId));
        require(_owns(_from, _tokenId));

        // Reassign ownership (also clears pending approvals and emits Transfer event).
        _transfer(_from, _to, _tokenId);
    }

    /// @notice Returns the total number of KittyCoins currently in existence.
    /// @dev Required for ERC-721 compliance.
    function totalSupply() public view returns (uint) {
        return kittyCoins.length - 1;
    }

    /// @notice Returns the address currently assigned ownership of a given KittyCoin.
    /// @dev Required for ERC-721 compliance.
    function ownerOf(uint256 _tokenId)
        external
        view
        returns (address _owner)
    {
        _owner = kittyCoinToOwner[_tokenId];

        require(_owner != address(0));
    }

    /// @notice Returns a list of all KittyCoin IDs assigned to an address.
    /// @param _owner The owner whose KittyCoins we are interested in.
    /// @dev This method MUST NEVER be called by smart contract code. First, it's fairly
    ///  expensive (it walks the entire KittyCoin array looking for coins belonging to owner),
    ///  but it also returns a dynamic array, which is only supported for web3 calls, and
    ///  not contract-to-contract calls.
    function tokensOfOwner(address _owner) external view returns(uint256[] ownerTokens) {
        uint256 tokenCount = balanceOf(_owner);

        if (tokenCount == 0) {
            // Return an empty array
            return new uint256[](0);
        } else {
            uint256[] memory result = new uint256[](tokenCount);
            uint256 totalKittyCoins = kittyCoins.length - 1;
            uint256 resultIndex = 0;

            // We count on the fact that all cats have IDs starting at 1 and increasing
            // sequentially up to the totalCat count.
            uint256 kittyCoinId;

            for (kittyCoinId = 1; kittyCoinId <= totalKittyCoins; kittyCoinId++) {
                if (kittyCoinToOwner[kittyCoinId] == _owner) {
                    result[resultIndex] = kittyCoinId;
                    resultIndex++;
                }
            }
            return result;
        }
    }

    /// @dev Adapted from memcpy() by @arachnid (Nick Johnson <arachnid@notdot.net>)
    ///  This method is licenced under the Apache License.
    ///  Ref: https://github.com/Arachnid/solidity-stringutils/blob/2f6ca9accb48ae14c66f1437ec50ed19a0616f78/strings.sol
    function _memcpy(
        uint _dest, 
        uint _src, 
        uint _len
    ) 
        private 
        pure 
    {
        // Copy word-length chunks while possible
        for (; _len >= 32; _len -= 32) {
            assembly {
                mstore(_dest, mload(_src))
            }
            _dest += 32;
            _src += 32;
        }

        // Copy remaining bytes
        uint256 mask = 256 ** (32 - _len) - 1;
        assembly {
            let srcpart := and(mload(_src), not(mask))
            let destpart := and(mload(_dest), mask)
            mstore(_dest, or(destpart, srcpart))
        }
    }

    /// @dev Adapted from toString(slice) by @arachnid (Nick Johnson <arachnid@notdot.net>)
    ///  This method is licenced under the Apache License.
    ///  Ref: https://github.com/Arachnid/solidity-stringutils/blob/2f6ca9accb48ae14c66f1437ec50ed19a0616f78/strings.sol
    function _toString(bytes32[4] _rawBytes, uint256 _stringLength) private pure returns (string) {
        var outputString = new string(_stringLength);
        uint256 outputPtr;
        uint256 bytesPtr;

        assembly {
            outputPtr := add(outputString, 32)
            bytesPtr := _rawBytes
        }

        _memcpy(outputPtr, bytesPtr, _stringLength);

        return outputString;
    }

    /// @notice Returns a URI pointing to a metadata package for this token conforming to
    ///  ERC-721 (https://github.com/ethereum/EIPs/issues/721)
    /// @param _tokenId The ID number of the Kitty whose metadata should be returned.
    function tokenMetadata(uint256 _tokenId, string _preferredTransport) external view returns (string infoUrl) {
        require(erc721Metadata != address(0));
        bytes32[4] memory buffer;
        uint256 count;

        (buffer, count) = erc721Metadata.getMetadata(_tokenId, _preferredTransport);
        return _toString(buffer, count);
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
    function _createKittyCoin(
        uint256 _kittyId, 
        uint256 _donationId, 
        uint256 _seed,
        address _owner
        ) 
            internal
            returns (uint)
        {
        
        KittyCoin memory _kittyCoin = KittyCoin({
            kittyId: _kittyId,
            donationId: _donationId,
            coinSeed: _seed
        });
        uint256 newKittyCoinId = kittyCoins.push(_kittyCoin) - 1;
        // It's probably never going to happen, 4 billion kittycoins is A LOT, but
        // let's just be 100% sure we never let this happen.
        require(newKittyCoinId == uint256(uint32(newKittyCoinId)));

        // This will assign ownership, and also emit the Transfer event as
        // per ERC721 draft
        _transfer(0, _owner, newKittyCoinId);

        // Send KittyCoin event
        emit NewKittyCoin(
            _owner,
            newKittyCoinId, 
            uint256(_kittyCoin.kittyId), 
            uint256(_kittyCoin.donationId), 
            uint256(_kittyCoin.coinSeed)
        );

        return newKittyCoinId;
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
    /// @return _kittyCoinId of the new KittyCoin
    function createRandomKittyCoin(uint256 _donationId) public returns(uint256) {
        // Confirm that the owner doesn't have any kittycoins
        require(kittyCoinCount[msg.sender] == 0);
        uint256 kittyId = donations[_donationId].kittyId;
        bytes5 kittyTraitSeed = kitties[kittyId].kittyTraitSeed;
        // the seed for the kittycoin is generated based on the input string
        uint256 randSeed = _generateRandomSeed(kittyTraitSeed);
        // The cat is created by a private function
        uint256 _kittyCoinId = _createKittyCoin(
            kittyId, 
            _donationId, 
            randSeed, 
            msg.sender
            );
        return _kittyCoinId;
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

        uint256 id = donations.push(Donation(
            _kittyId, 
            _trustAddress, 
            _fosterAddress, 
            _trustAmount, 
            _fosterAmount
            )) - 1;

        // Complete the transaction
        pendingWithdrawals[_trustAddress] = SafeMath.add(pendingWithdrawals[_trustAddress], _trustAmount);
        pendingWithdrawals[_fosterAddress] = SafeMath.add(pendingWithdrawals[_fosterAddress], _fosterAmount);

        donationToDonator[id] = msg.sender;
        donationCount[msg.sender]++;

        // Safe Maths sum total
        uint256 totalAmount = SafeMath.add(_trustAmount, _fosterAmount);

        // Add amount to a kitties donation limit
        kitties[_kittyId].donationAmount = SafeMath.add(kitties[_kittyId].donationAmount, totalAmount);

        emit NewDonation(
            id, 
            _kittyId, 
            _trustAmount,
            _fosterAmount, 
            totalAmount
            );
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
        uint256 fosterAmount = _fosterAmount;
        uint256 donationLimit = SafeMath.sub(kitties[_kittyId].donationCap, kitties[_kittyId].donationAmount);
        if (donationLimit <= 0) {
            fosterAmount = 0;
        }
        if (fosterAmount >= donationLimit) {
            uint256 fosterOverflow = SafeMath.sub(_fosterAmount, donationLimit);
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
            
        uint256 id = kitties.push(Kitty(
            _enabled, 
            _trustAddr, 
            _fosterAddr, 
            _traitSeed, 
            _donationCap,
            0 // Default donation start at 0
            )) - 1;

        kittyToTrust[id] = msg.sender;
        kittyCount[msg.sender]++;
        emit NewKitty(
            id, 
            _trustAddr, 
            _fosterAddr, 
            _traitSeed, 
            _donationCap
            );
    }

    /// @notice Creates a new kitty which goes up for donation
    /// @param _fosterAddress The wallet address of the foster carer
    /// @param _traitSeed Unique traits for this kitty
    /// @param _donationCap The maximum amount that the carer can receive
    function createKitty(address _fosterAddress, bytes5 _traitSeed, uint256 _donationCap) onlyTrust public {
        require(_donationCap > 0);
        _createKitty(
            true, 
            msg.sender, 
            _fosterAddress, 
            _traitSeed, 
            _donationCap
            );
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
        uint256 donationCap,
        uint256 donationAmount
    ) {
        Kitty storage kitty = kitties[_kittyId];
        isEnabled = kitty.donationsEnabled;
        trustAddress = kitty.trustAddress;
        fosterAddress = kitty.fosterAddress;
        traitSeed = bytes5(kitty.kittyTraitSeed);
        donationCap = uint256(kitty.donationCap);
        donationAmount = uint256(kitty.donationAmount);
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
        emit NewTrust(id);
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
        emit ChangedTrustAddress(_id, _newTrustAddr);
    }

    /// @notice Checks if a given address belongs to a trust
    /// @param _address is the address that needs to be checked
    /// @return a boolean defining if a given address belongs to a trust
    function isTrustAddress(address _address) public view returns (bool) {
        return trusted[_address];
    }
}