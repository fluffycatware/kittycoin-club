/* eslint no-undef: "off" */
var KittyCoinClub = artifacts.require('KittyCoinClub');

contract('KittyCoinClub', function (accounts) {
  var helpfulFunctions = require('./utils/TestUtils')(KittyCoinClub, accounts);
  var hfn = Object.keys(helpfulFunctions);
  for (var i = 0; i < hfn.length; i++) {
    global[hfn[i]] = helpfulFunctions[hfn[i]];
  }

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

  // account[0] should be able to give trust status to account[1]
  checkCanApplyTrustToAccount(1, 0);

  // account[0] should be able to give trust status to themselves
  checkCanApplyTrustToAccount(0, 0);
});
