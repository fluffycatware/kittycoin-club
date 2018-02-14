/* eslint no-undef: "off" */
var KittyCoinClub = artifacts.require('KittyCoinClub');

contract('KittyCoinClub', function (accounts) {
  var helpfulFunctions = require('./utils/TestUtils')(KittyCoinClub, accounts);
  var hfn = Object.keys(helpfulFunctions);
  for (var i = 0; i < hfn.length; i++) {
    global[hfn[i]] = helpfulFunctions[hfn[i]];
  }

  /** Accounts
   * ---------------------------------------------------
   * | ID | Address                                    |
   * |----|--------------------------------------------|
   * | 0  | 0x627306090abaB3A6e1400e9345bC60c78a8BEf57 |
   * | 1  | 0xf17f52151EbEF6C7334FAD080c5704D77216b732 |
   * | 2  | 0xC5fdf4076b8F3A5357c5E395ab970B5B54098Fef |
   * | 3  | 0x821aEa9a577a9b44299B9c15c88cf3087F3b5544 |
   * | 4  | 0x0d1d4e623D10F9FBA5Db95830F7d3839406C6AF2 |
   * | 5  | 0x2932b7A2355D6fecc4b5c0B6BD44cC31df247a2e |
   * | 6  | 0x2191eF87E392377ec08E7c08Eb105Ef5448eCED5 |
   * | 7  | 0x0F4F2Ac550A1b4e2280d04c21cEa7EBD822934b5 | 
   * | 8  | 0x6330A553Fc93768F612722BB8c2eC78aC90B3bbc |
   * | 9  | 0x5AEDA56215b167893e80B4fE645BA6d5Bab767DE | 
   * ---------------------------------------------------
   */

  /** Trust Usage
   * ----------------------------------------------------------------------
   * | Trust ID | Account ID | Account Address                            |
   * |----------|------------|------------------------------------------- |
   * | 0        | 3          | 0x821aEa9a577a9b44299B9c15c88cf3087F3b5544 |
   * | 1        | 0          | 0x627306090abaB3A6e1400e9345bC60c78a8BEf57 |
   * ----------------------------------------------------------------------
   */

  /** Kitty Usage
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

  // account[5] should be able to donate 1.0 eth to kitty[0], with 0.1 to trust and 0.9 to foster
  checkCanCreateDonation(0, 0.1, 0.9, 1.0, 5);

  // account[5] should be able to donate 1.0 eth to kitty[1], with 0.2 to trust and 0.8 to foster
  checkCanCreateDonation(1, 0.2, 0.8, 1.0, 5);

  // account[5] should be able to donate 1.0 eth to kitty[2], with 0.3 to trust and 0.7 to foster
  checkCanCreateDonation(2, 0.3, 0.7, 1.0, 5);

  // account[5] should be able to donate 1.0 eth to kitty[3], with 0.4 to trust and 0.6 to foster
  checkCanCreateDonation(3, 0.4, 0.6, 1.0, 5);

  // account[5] should be able to donate 1.0 eth to kitty[4], with 0.5 to trust and 0.5 to foster
  checkCanCreateDonation(4, 0.5, 0.5, 1.0, 5);

  // account[5] should be able to donate 1.0 eth to kitty[5], with 0.6 to trust and 0.4 to foster
  checkCanCreateDonation(5, 0.6, 0.4, 1.0, 5);

  // account[5] should be able to donate 1.0 eth to kitty[6], with 0.7 to trust and 0.3 to foster
  checkCanCreateDonation(6, 0.7, 0.3, 1.0, 5);

  // account[5] should be able to donate 1.0 eth to kitty[7], with 0.8 to trust and 0.2 to foster
  checkCanCreateDonation(7, 0.8, 0.2, 1.0, 5);

  // account[5] should be able to donate 1.0 eth to kitty[8], with 0.9 to trust and 0.1 to foster
  checkCanCreateDonation(8, 0.9, 0.1, 1.0, 5);

  // account[5] should be able to donate 1.0 eth to kitty[9], with 1.0 to trust and 0.0 to foster
  checkCanCreateDonation(9, 1.0, 0, 1.0, 5);

  // account[5] should have 10 donations
  checkNumberOfDonationsForDonator(5, 10);

  // account[4] should not have 10 donations
  checkNumberOfDonationsForDonator(4, 10, 'expect to fail');

  // account[2] should have 0 donations
  checkNumberOfDonationsForDonator(2, 0);

  // total number of donations is 10
  checkDonationAggregator(10);

  // total number of donations is not 5
  checkDonationAggregator(5, 'expect to fail');

  // total number of kitties is 11
  checkKittyAggregator(11);

  // total number of kitties is not 5
  checkKittyAggregator(5, 'expect to fail');

  // account[5] should have 0 kittycoins
  checkKittyCoinAggregator(0, 5);

  // account[5] should not have 1 kittycoins
  checkKittyCoinAggregator(1, 5, 'expect to fail');

  // kitty[0] should be enabled, account[3] trust, account[4] foster, donationCap of 0.1 have traitSeed 0x00738ea43a
  checkKitty(0, true, 3, 4, '0x00738ea43a', 0.1);

  // kitty[1] should not be enabled, account[3] trust, account[4] foster, donationCap of 0.1 have traitSeed 0x00738ea43a
  checkKitty(1, false, 1, 2, '0x00738ea43a', 0.1, 'expect to fail');

  // donation[0] should have kitty[0], account[3] trust, account[4] foster, 
  // 0.9 eth trust, 0.1 eth foster due to foster cap of 0.1 eth
  checkDonation(0, 0, 3, 4, 0.9, 0.1);

  // donation[0] should not have kitty[1], account[1] trust, account[2] foster, 
  // 0.1 eth trust, 0.9 eth foster
  checkDonation(0, 1, 1, 2, 0.1, 0.9, 'expect to fail');
});
