var Ownable = artifacts.require('ownership/Ownable.sol');
var Donation = artifacts.require('Donation');

module.exports = function (deployer) {
  deployer.deploy(Ownable);
  deployer.deploy(Donation);
};
