
/* eslint no-undef: "off" */
const KittyCoinClub = artifacts.require('../contracts/KittyCoinClub');

contract('KittyCoinClub', function (accounts) {
  // ----------------------------------
  // Before
  // ----------------------------------
  let kittycoinclub;
  const owner = accounts[0];
  const trust = accounts[1];

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

  it('owner can create a trusted address', async function () {
    await kittycoinclub.createTrust(trust)
      .then(function (result) {
        assert.include(result.logs[0].event, 'NewTrust', 'NewTrust event was not triggered');
      });
  });

  // it('trust should be allowed to create a kitty', async function () {
  //   await kittycoinclub.createKitty(foster, '0x00f9e605e3', 0.003)
  //     .then(function (result) {
  //       assert.include(result.logs[0].event, 'NewKitty', 'NewKitty event was not triggered');
  //     });
  // });
});
