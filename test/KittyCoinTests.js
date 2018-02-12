/* eslint no-undef: "off" */
var KittyCoinClub = artifacts.require('KittyCoinClub');

contract('KittyCoinClub', function (accounts) {
  var helpfulFunctions = require('./utils/TestUtils')(KittyCoinClub, accounts);
  var hfn = Object.keys(helpfulFunctions);
  for (var i = 0; i < hfn.length; i++) {
    global[hfn[i]] = helpfulFunctions[hfn[i]];
  }

  /**
   * ------------------------------------------------
   * | Kitty ID | Kitty Seed   | Donation Cap (eth) |
   * |----------|--------------|------------------- |
   * | 0        | 0x00738ea43a | 0.1                |
   * | 1        | 0x00661a3341 | 0.2                |               
   * | 2        | 0x0039749d53 | 0.3                |
   * | 3        | 0x007d4bf443 | 0.4                |
   * | 4        | 0x0098d8c2f0 | 0.5                |
   * | 5        | 0x0033c81d7c | 0.6                |
   * | 6        | 0x002bcfbacf | 0.7                |
   * | 7        | 0x00625cc596 | 0.8                |
   * | 8        | 0x00b5348ba3 | 0.9                |
   * | 9        | 0x008ebbd965 | 1.0                |
   * | 10       | 0x00dcccea0d | 1.1                |
   * ------------------------------------------------
   */

  // checks whether remainingKittyCoins and remainingFounderCoins equal to totalSupply
  checkAddsUpToTotalSupply();

  // checks to confirm the token details match the ones supplies
  checkTokenVariables('KittyCoinClub', '🐱', 0);

  // should be 25344 remainingCats (non-genesis cats)
  checkRemainingKittyCoins(25344);

  // should be 256 remainingFounderCoins
  checkRemainingFounderCoins(256);

  // account[0] should have a balance of 0 for the balance types
  checkAccountKittyCoinCount(0, 0);
  checkAccountDonationCount(0, 0);
  checkAccountKittyCount(0, 0);

  // account[0] should have a pendingWithdrawals of 0
  checkPendingWithdrawals(0, 0);

  // account[1] should have a balance of 0 for the balance types
  checkAccountKittyCoinCount(1, 0);
  checkAccountDonationCount(1, 0);
  checkAccountKittyCount(1, 0);

  // account[1] should have a pendingWithdrawals of 0
  checkPendingWithdrawals(1, 0);

  // account[1] should not be able to give trust status to account[2]
  checkCanApplyTrustToAccount(2, 1, 'expect to fail');

  // account[1] should not be able to give trust status to themselves
  checkCanApplyTrustToAccount(1, 1, 'expect to fail');

  // account[0] should be able to give trust[0] to account[1]
  checkCanApplyTrustToAccount(1, 0);

  // account[0] should be able to give trust[1] to themselves
  checkCanApplyTrustToAccount(0, 0);

  // account[0] should be a trust
  checkAccountIsTrust(0);

  // account[1] should be a trust
  checkAccountIsTrust(1);

  // account[3] should not be a trust
  checkAccountIsTrust(3, 'expect to fail');

  // account[1] should be able to give account[3] ownership of trust[0]
  checkChangeTrustAddress(0, 3, 1);

  // account[3] should be a trust
  checkAccountIsTrust(3);

  // account[1] should not be a trust
  checkAccountIsTrust(1, 'expect to fail');

  // account[1] should not be able to give account[2] ownership of trust[1]
  checkChangeTrustAddress(1, 2, 1, 'expect to fail');

  // account[3] should not be able to give account[2] ownership of trust[1]
  checkChangeTrustAddress(1, 2, 3, 'expect to fail');

  // account[3] should be able to create kitty[0] with account[3] as trust address 
  // and account[4] address as a foster with a cap of 0.1 eth
  checkCanCreateKitty(4, '0x00738ea43a', 0.1, 3);

  // account[1] should not be able to create kitty[1] with account[1] as trust address 
  // and account[4] address as a foster with a cap of 3 eth
  checkCanCreateKitty(4, '0x00661a3341', 0.2, 1, 'expect to fail');

  // account[3] should not be able to create kitty[1] with account[3] as trust address 
  // and account[4] address as a foster with a cap of 0 eth
  checkCanCreateKitty(4, '0x00661a3341', 0, 3, 'expect to fail');

  // account[3] should be able to create kitty[1] with account[3] as trust address 
  // and account[4] address as a foster with a cap of 0.2 eth
  checkCanCreateKitty(4, '0x00661a3341', 0.2, 3);

  // account[3] should be able to create kitty[2] with account[3] as trust address 
  // and account[4] address as a foster with a cap of 0.3 eth
  checkCanCreateKitty(4, '0x0039749d53', 0.3, 3);

  // account[3] should be able to create kitty[3] with account[3] as trust address 
  // and account[4] address as a foster with a cap of 0.4 eth
  checkCanCreateKitty(4, '0x007d4bf443', 0.4, 3);

  // account[3] should be able to create kitty[4] with account[3] as trust address 
  // and account[4] address as a foster with a cap of 0.5 eth
  checkCanCreateKitty(4, '0x0098d8c2f0', 0.5, 3);

  // account[3] should be able to create kitty[5] with account[3] as trust address 
  // and account[4] address as a foster with a cap of 0.6 eth
  checkCanCreateKitty(4, '0x0033c81d7c', 0.6, 3);

  // account[3] should be able to create kitty[6] with account[3] as trust address 
  // and account[4] address as a foster with a cap of 0.7 eth
  checkCanCreateKitty(4, '0x002bcfbacf', 0.7, 3);

  // account[3] should be able to create kitty[7] with account[3] as trust address 
  // and account[4] address as a foster with a cap of 0.8 eth
  checkCanCreateKitty(4, '0x00625cc596', 0.8, 3);

  // account[3] should be able to create kitty[8] with account[3] as trust address 
  // and account[4] address as a foster with a cap of 0.9 eth
  checkCanCreateKitty(4, '0x00b5348ba3', 0.9, 3);

  // account[3] should be able to create kitty[9] with account[3] as trust address 
  // and account[4] address as a foster with a cap of 1.0 eth
  checkCanCreateKitty(4, '0x008ebbd965', 1.0, 3);

  // account[3] should be able to create kitty[10] with account[3] as trust address 
  // and account[4] address as a foster with a cap of 1.1 eth
  checkCanCreateKitty(4, '0x00dcccea0d', 1.1, 3);
});
