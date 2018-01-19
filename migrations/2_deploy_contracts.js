var Ownable = artifacts.require('./ownership/Ownable.sol');
var Donation = artifacts.require('./Donation');
var KittyCoinFactory = artifacts.require('./KittyCoinFactory');
var KittyCoinHandler = artifacts.require('./KittyCoinHandler');

module.exports = function (deployer) {
  deployer.deploy(Ownable);
  deployer.deploy(Donation);
  deployer.deploy(KittyCoinFactory);
  deployer.deploy(KittyCoinHandler);
};
