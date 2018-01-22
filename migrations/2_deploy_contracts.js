var Ownable = artifacts.require('./ownership/Ownable.sol');
var Donation = artifacts.require('./Donation');
var KittyCoinFactory = artifacts.require('./KittyCoinFactory');
var KittyCoinHandler = artifacts.require('./KittyCoinHandler');
var KittyFactory = artifacts.require('./KittyFactory');
var TrustFactory = artifacts.require('./TrustFactory');

module.exports = function (deployer) {
  deployer.deploy(Ownable);
  deployer.deploy(Donation);
  deployer.deploy(KittyCoinFactory);
  deployer.deploy(KittyCoinHandler);
  deployer.deploy(KittyFactory);
  deployer.deploy(TrustFactory);
};
