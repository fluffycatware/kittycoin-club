var Ownable = artifacts.require('./ownership/Ownable');
var KittyCoinClub = artifacts.require('./KittyCoinClub');

module.exports = function (deployer) {
  deployer.deploy(Ownable);
  deployer.deploy(KittyCoinClub);
};
