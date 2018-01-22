pragma solidity ^0.4.18;

import "./ownership/Ownable.sol";

/**
 * @title TrustFactory
 * @dev The TrustFactory manages anything to do with the creation,
 * deletion and modificaiton of charitable trusts
 */
contract TrustFactory is Ownable {

    /* Events */
    event NewTrust(uint trustId);
    event ChangedTrustAddress(uint trustId, address trustAddr);

    /* Mappings */
    mapping (uint => address) addressLookup;
    
    /**
    * @dev Throws if called by any account other then the owner
    * of the trust being modified
    */
    modifier onlyTrustOwner(uint _trustId) {
        require(msg.sender == addressLookup[_trustId]);
        _;
    }

    struct Trust {
        // Allows a trust to be untrusted
        bool trustEnabled;
        // Trust address of the charity or org that put up
        address trustAddress;
    }

    Trust[] public trusts;

    /**
    * @dev Private trust creation that is handled internally
    * @param _enabled Is the trust enabled
    * @param _trustAddr The address to link this trust to
    */
    function _createTrust(bool _enabled, address _trustAddr) internal {
        // 'id' is the index of the trust in the array of trusts
        uint id = trusts.push(Trust(_enabled, _trustAddr)) - 1;
        // Map both the address to the trust
        // and the trust to the address
        addressLookup[id] = _trustAddr;
        // Send an event alerting the Trusts creation
        NewTrust(id);
    }

    /**
    * @dev Allows the contract owner to add a new trust
    * @param _trustAddr The address to link this trust to
    */
    function createTrust(address _trustAddr) onlyOwner public {
        _createTrust(true, _trustAddr);
    }

    /**
    * @dev Allows the contract owner to enable and disable trusts
    * @param _id The id of the trust that should be toggled
    * @param _enabled A boolean true or false, where true is to enable
    * and false is to disable the trust
    */
    function toggleTrust(uint _id, bool _enabled) onlyOwner public {
        trusts[_id].trustEnabled = _enabled;
    }

    /**
    * @dev Allows a trust to change their address
    * @param _id The id of the trust where the address wants to be altered;
    * the msg.sender must match the address in the id being changed
    * @param _newTrustAddr The new trust address to be set
    */
    // 
    function changeTrustAddress(uint _id, address _newTrustAddr) onlyTrustOwner(_id) public {
        trusts[_id].trustAddress = _newTrustAddr;
        addressLookup[_id] = _newTrustAddr;
        ChangedTrustAddress(_id, _newTrustAddr);
    }
}