var Ownable = artifacts.require('./ownership/Ownable');
var KittyCoinClub = artifacts.require('./KittyCoinClub');
var KittyCoinFactory = artifacts.require('./KittyCoinFactory');
var KittyFactory = artifacts.require('./KittyFactory');
var TrustFactory = artifacts.require('./TrustFactory');
var Donation = artifacts.require('./DonationFactory');

module.exports = function (deployer) {
  deployer.deploy(Ownable);
  deployer.deploy(KittyCoinClub);
  deployer.deploy(KittyCoinFactory);
  deployer.deploy(KittyFactory);
  deployer.deploy(TrustFactory);
  deployer.deploy(Donation);
};
