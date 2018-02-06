/* eslint no-undef: "off" */
var BigNumber = require('bignumber.js');
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
  const donator1 = accounts[4];

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

    // Toggle the new trust off using owner function
    await kittycoinclub.toggleTrust(0, false, {
      from: owner,
    });

    // Check that trust2 IS a trust
    const toggledResultTrust2 = await kittycoinclub.isTrustAddress(trust2);
    assert.equal(toggledResultTrust2, false);
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

  it('should be able to make donations to a kitty', async function () {
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

    // donator1 makes a series of donations to a new kitty
    for (let amount = 0.1; amount < 1.4; amount = amount + 0.4) {
      for (let ratio = 0; ratio <= 100; ratio = ratio + 50) {
        var foster = new BigNumber(amount).times(ratio).dividedBy(100);
        var trust = new BigNumber(amount).minus(foster);

        var totalAmount = web3.toWei(amount, 'ether');
        var fosterAmount = web3.toWei(foster.toNumber(), 'ether');
        var trustAmount = web3.toWei(trust.toNumber(), 'ether');

        await kittycoinclub.makeDonation(0, trustAmount, fosterAmount, {
          from: donator1,
          value: totalAmount,
        }).then(function (result) {
          const logs = result.logs[0].args;
          const trustAmount = logs.trustAmount;
          const donationId = logs.donationId;
          const kittyId = logs.kittyId;
          const fosterAmount = logs.fosterAmount;
          const totalDonationAmount = logs.totalDonationAmount;
          console.log(
            '\tamount: ' + amount +
            '\tratio: ' + ratio +
            '\tdonationId: ' + donationId +
            '\tkittyId: ' + kittyId +
            '\ttrustAmount: ' + trustAmount +
            '\tfosterAmount: ' + fosterAmount +
            '\ttotalDonationAmount: ' + totalDonationAmount
          );
          // Assert that the total donated amount equals the amount processed by the contract
          assert(web3.fromWei(logs.totalDonationAmount, 'ether'), amount);
          assert.include(result.logs[0].event, 'NewDonation', 'NewDonation event was not triggered');
        });
      }
    }
  });
});
