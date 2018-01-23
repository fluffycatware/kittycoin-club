var Ownable = artifacts.require('./ownership/Ownable');
var Donation = artifacts.require('./Donation');
var KittyCoinClub = artifacts.require('./KittyCoinClub');
var KittyCoinFactory = artifacts.require('./KittyCoinFactory');
var KittyFactory = artifacts.require('./KittyFactory');
var TrustFactory = artifacts.require('./TrustFactory');

module.exports = function (deployer) {
  deployer.deploy(Ownable);
  deployer.deploy(Donation);
  deployer.deploy(KittyCoinClub);
  deployer.deploy(KittyCoinFactory);
  deployer.deploy(KittyFactory);
  deployer.deploy(TrustFactory);
};
