var Ownable = artifacts.require('./ownership/Ownable');
var SafeMathMock = artifacts.require('./mocks/SafeMathMock');
var KittyCoinClub = artifacts.require('./KittyCoinClub');

module.exports = function (deployer) {
  deployer.deploy(Ownable);
  deployer.deploy(SafeMathMock);
  deployer.deploy(KittyCoinClub);
};
