// Specifically request an abstraction for KittyCoinHelper
var KittyCoinHandler = artifacts.require('../contracts/KittyCoinHandler');

contract('KittyCoinHandler', function (accounts) {
  it('should throw if the NewKittyCoin event isn\'t triggered', function () {
    return KittyCoinHandler.deployed()
    .then(function (instance) {
      return instance.createRandomKittyCoin('Gracie');
    })
    .catch(function (error) {
      assert.fail('NewKittyCoin was not triggered: ' + error);
    })
    .then(function (result) {
      assert.include(result.logs[0].event, 'NewKittyCoin', 'NewKittyCoin event was not triggered');
    });
  });
});
