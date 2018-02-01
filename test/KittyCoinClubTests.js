/* eslint no-undef: "off" */
const KittyCoinClub = artifacts.require('KittyCoinClub');

contract('KittyCoinClub', function (accounts) {
  // ----------------------------------
  // Before
  // ----------------------------------

  const owner = accounts[0];
  const trust = accounts[1];
  let kittycoinclub;

  // converts strings to 32 bytes hexes
  // function stringTo32BytesHex (string) {
  //   var hex = web3.fromUtf8(string);
  //   hex = (hex + '0000000000000000000000000000000000000000000000000000000000000000').slice(0, 66);
  //   return hex;
  // };

  beforeEach(async function () {
    kittycoinclub = await KittyCoinClub.new();
  });

  it('should have a name for its token', async function () {
    const name = await kittycoinclub.name();
    assert.equal(name, 'KittyCoinClub');
  });

  it('should have a symbol for its token', async function () {
    const symbol = await kittycoinclub.symbol();
    assert.equal(symbol, '🐱');
  });

  it('should have 0 decimals for its token', async function () {
    const decimals = await kittycoinclub.decimals();
    assert(decimals.eq(0));
  });

  it('should has a total kittycoin supply of 25600 for its token', async function () {
    const totalSupply = await kittycoinclub.totalSupply();
    assert(totalSupply.eq(25600));
  });

  it('should allow owner to make an address trusted', async function () {
    await kittycoinclub.createTrust(trust, {
      from: owner,
    }).then(function (result) {
      assert.include(result.logs[0].event, 'NewTrust', 'NewTrust event was not triggered');
    });
  });

  // it('should confirm that ' + trust + ' is in fact a trust', async function () {
  //   await kittycoinclub.isTrustAddress(trust, {
  //     from: owner,
  //   })
  //     .then(function (result) {
  //       assert(result, true, 'trust address is not a trust');
  //     });
  // });

  // it('trust should be allowed to create a kitty', async function () {
  //   var price = web3.toWei(3, 'ether');
  //   var seed = stringTo32BytesHex('0x00f9e605e3');
  //   await kittycoinclub.createKitty(foster, seed, price, {
  //     from: trust,
  //   })
  //     .then(function (result) {
  //       console.log(result);
  //       assert.include(result.logs[0].event, 'NewKitty', 'NewKitty event was not triggered');
  //     });
  // });
});
