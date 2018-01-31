/* eslint no-undef: "off" */
const KittyCoinClub = artifacts.require('../contracts/KittyCoinClub');

// var errorMessage = 'Error: VM Exception while processing transaction: invalid opcode';

contract('KittyCoinClub', function (accounts) {
  // ----------------------------------
  // Before
  // ----------------------------------
  let kittycoinclub;
  const owner = accounts[0];
  const trust = accounts[1];
  // const foster = accounts[2];

  // converts strings to 32 bytes hexes
  // function stringTo32BytesHex (string) {
  //   var hex = web3.fromUtf8(string);
  //   hex = (hex + '0000000000000000000000000000000000000000000000000000000000000000').slice(0, 66);
  //   return hex;
  // };

  beforeEach(async function () {
    kittycoinclub = await KittyCoinClub.new({
      from: owner,
    });
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
    await kittycoinclub.createTrust(trust, {
      from: owner,
    })
      .then(function (result) {
        assert.include(result.logs[0].event, 'NewTrust', 'NewTrust event was not triggered');
      });
  });

  // it('trust address is actually a trust', async function () {
  //   await kittycoinclub.isTrustAddress(trust, {
  //     from: owner,
  //   })
  //     .then(function (result) {
  //       assert.include(result, 'true ', 'trust address is not a trust');
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
