
/* eslint no-undef: "off" */
const KittyCoinClub = artifacts.require('../contracts/KittyCoinClub');

contract('KittyCoinClub', function (accounts) {
  // ----------------------------------
  // Before
  // ----------------------------------
  let kittycoinclub;
  const owner = accounts[0];

  beforeEach(async function () {
    kittycoinclub = await KittyCoinClub.new({ from: owner });
  });

  it('has a name', async function () {
    const name = await kittycoinclub.name();
    assert.equal(name, 'KittyCoinClub');
  });

  it('has a symbol', async function () {
    const symbol = await kittycoinclub.symbol();
    assert.equal(symbol, '🐱');
  });

  it('has 0 decimals', async function () {
    const decimals = await kittycoinclub.decimals();
    assert(decimals.eq(0));
  });

  it('has a total kittycoin supply of 25600', async function () {
    const totalSupply = await kittycoinclub.totalSupply();
    assert(totalSupply.eq(25600));
  });

  it('should allow a random kittycoin with name `Gracie`', async function () {
    await kittycoinclub.createRandomKittyCoin('Gracie')
    .then(function (result) {
      assert.include(result.logs[0].event, 'NewKittyCoin', 'NewKittyCoin event was not triggered');
    });
  });
});
