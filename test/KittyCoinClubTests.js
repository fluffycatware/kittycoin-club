/* eslint no-undef: "off" */
const KittyCoinClub = artifacts.require('KittyCoinClub');

contract('KittyCoinClub', function (accounts) {
  // ----------------------------------
  // Before
  // ----------------------------------

  let kittycoinclub;
  const owner = accounts[0];
  const trust1 = accounts[1];
  const trust2 = accounts[2];
  const foster1 = accounts[3];

  beforeEach(async function () {
    kittycoinclub = await KittyCoinClub.new();
  });

  it('should have a name for its token', async function () {
    // Initial state of contract puts token name as KittyCoinClub
    const name = await kittycoinclub.name();
    assert.equal(name, 'KittyCoinClub');
  });

  it('should have a symbol for its token', async function () {
    // Initial state of contract puts token symbol as 🐱
    const symbol = await kittycoinclub.symbol();
    assert.equal(symbol, '🐱');
  });

  it('should have 0 decimals for its token', async function () {
    // Initial state of contract puts token decimal at 0
    const decimals = await kittycoinclub.decimals();
    assert(decimals.eq(0));
  });

  it('should has a total kittycoin supply of 25600 for its token', async function () {
    // Initial state of contract puts token supply at 25600
    const totalSupply = await kittycoinclub.totalSupply();
    assert(totalSupply.eq(25600));
  });

  it('should allow owner to make an address trusted', async function () {
    // Check that trust1 is NOT a trust
    const initResultTrust1 = await kittycoinclub.isTrustAddress(trust1);
    assert.equal(initResultTrust1, false);
    // Check that trust2 is not a trust
    const initResultTrust2 = await kittycoinclub.isTrustAddress(trust2);
    assert.equal(initResultTrust2, false);

    // Turn trust1 address into a trust
    await kittycoinclub.createTrust(trust1, {
      from: owner,
    }).then(function (result) {
      assert.include(result.logs[0].event, 'NewTrust', 'NewTrust event was not triggered');
    });

    // Check that trust1 IS a trust
    const newResultTrust1 = await kittycoinclub.isTrustAddress(trust1);
    assert.equal(newResultTrust1, true);
    // Check that trust2 is NOT a trust
    const newResultTrust2 = await kittycoinclub.isTrustAddress(trust2);
    assert.equal(newResultTrust2, false);

    // Change ownership that trust1 has to trust2
    await kittycoinclub.changeTrustAddress(0, trust2, {
      from: trust1,
    }).then(function (result) {
      assert.include(result.logs[0].event, 'ChangedTrustAddress', 'ChangedTrustAddress event was not triggered');
    });

    // Check that trust1 is NOT trust
    const finalResultTrust1 = await kittycoinclub.isTrustAddress(trust1);
    assert.equal(finalResultTrust1, false);
    // Check that trust2 IS a trust
    const finalResultTrust2 = await kittycoinclub.isTrustAddress(trust2);
    assert.equal(finalResultTrust2, true);
  });

  it('trust should be allowed to create a kitty', async function () {
    // Turn trust1 address into a trust
    await kittycoinclub.createTrust(trust1, {
      from: owner,
    }).then(function (result) {
      assert.include(result.logs[0].event, 'NewTrust', 'NewTrust event was not triggered');
    });

    // Make put up a kitty for donation
    var price = web3.toWei(3, 'ether');
    var seed = '0x00f9e605e3';
    await kittycoinclub.createKitty(foster1, seed, price, {
      from: trust1,
    }).then(function (result) {
      assert.include(result.logs[0].event, 'NewKitty', 'NewKitty event was not triggered');
    });
  });
});
