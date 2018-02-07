module.exports = function (KittyCoinClub, accounts) {
  var errorMessage = 'Error: VM Exception while processing transaction: revert';

  /* ANSI Shadow (http://patorjk.com/software/taag)

    ████████╗ ██████╗ ██╗  ██╗███████╗███╗   ██╗        
    ╚══██╔══╝██╔═══██╗██║ ██╔╝██╔════╝████╗  ██║        
       ██║   ██║   ██║█████╔╝ █████╗  ██╔██╗ ██║        
       ██║   ██║   ██║██╔═██╗ ██╔══╝  ██║╚██╗██║        
       ██║   ╚██████╔╝██║  ██╗███████╗██║ ╚████║        
       ╚═╝    ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═╝  ╚═══╝        
                                                        
    ██████╗ ███████╗████████╗ █████╗ ██╗██╗     ███████╗
    ██╔══██╗██╔════╝╚══██╔══╝██╔══██╗██║██║     ██╔════╝
    ██║  ██║█████╗     ██║   ███████║██║██║     ███████╗
    ██║  ██║██╔══╝     ██║   ██╔══██║██║██║     ╚════██║
    ██████╔╝███████╗   ██║   ██║  ██║██║███████╗███████║                                                           
  */

  // checks whether remainingKittyCoins and remainingFounderCoins equal to totalSupply
  function checkAddsUpToTotalSupply () {
    it('should be equal to totalSupply', function (done) {
      KittyCoinClub.deployed().then(function (instance) {
        instance.totalSupply.call().then(function (totalSupply) {
          instance.remainingKittyCoins.call().then(function (remainingKittyCoins) {
            instance.remainingFounderCoins.call().then(function (remainingFounderCoins) {
              assert.equal((
                remainingKittyCoins.toNumber() +
                remainingFounderCoins.toNumber()), totalSupply.toNumber()
                , 'total remainingCats + remainingGenesisCats not equal to totalSupply');
            }).then(done).catch(done);
          });
        });
      });
    });
  };

  // checks whether the expected value of totalSupply is the current value
  function checksTotalSupply (expectedValue) {
    it('totalSupply should be equal to ' + expectedValue, function (done) {
      KittyCoinClub.deployed().then(function (instance) {
        instance.totalSupply.call().then(function (totalSupply) {
          assert.equal(totalSupply, expectedValue
            , 'totalSupply is not equal to ' + expectedValue);
        }).then(done).catch(done);
      });
    });
  };

  // checks to see whether the expected value of remainingFounderCoins is equal to the current value
  function checkRemainingFounderCoins (expectedValue) {
    it('remainingFounderCoins should be equal to ' + expectedValue, function (done) {
      KittyCoinClub.deployed().then(function (instance) {
        instance.remainingFounderCoins.call().then(function (remainingFounderCoins) {
          assert.equal(remainingFounderCoins, expectedValue
            , 'remainingFounderCoins is not equal to ' + expectedValue);
        }).then(done).catch(done);
      });
    });
  };

  // checks to see whether the expected value of remainingKittyCoins is the current value
  function checkRemainingKittyCoins (expectedValue) {
    it('remainingKittyCoins should be ' + expectedValue, function (done) {
      KittyCoinClub.deployed().then(function (instance) {
        instance.remainingKittyCoins.call().then(function (remainingKittyCoins) {
          assert.equal(remainingKittyCoins.valueOf(), expectedValue
            , 'remainingKittyCoins is not equal to ' + expectedValue);
        }).then(done).catch(done);
      });
    });
  };

  function checkTokenVariables (tokenName, tokenSymbol, tokenDecimals) {
    it('token should have the name ' + tokenName + 
      ', symbol ' + tokenSymbol + 
      ' and decimals of ' + tokenDecimals, function (done) {
      KittyCoinClub.deployed().then(function (instance) {
        instance.name.call().then(function (_tokenName) {
          instance.symbol.call().then(function (_tokenSymbol) {
            instance.decimals.call().then(function (_tokenDecimals) {
              assert.equal(_tokenName, tokenName, 'tokenName does not equal ' + tokenName);
              assert.equal(_tokenSymbol, tokenSymbol, 'tokenSymbol does not equal ' + tokenSymbol);
              assert.equal(_tokenDecimals, tokenDecimals, 'tokenDecimals does not equal ' + tokenDecimals);
            }).then(done).catch(done);
          });
        });
      });
    });
  };

  /*
   █████╗  ██████╗ ██████╗ ██████╗ ██╗   ██╗███╗   ██╗████████╗     
  ██╔══██╗██╔════╝██╔════╝██╔═══██╗██║   ██║████╗  ██║╚══██╔══╝     
  ███████║██║     ██║     ██║   ██║██║   ██║██╔██╗ ██║   ██║        
  ██╔══██║██║     ██║     ██║   ██║██║   ██║██║╚██╗██║   ██║        
  ██║  ██║╚██████╗╚██████╗╚██████╔╝╚██████╔╝██║ ╚████║   ██║        
  ╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═══╝   ╚═╝        
                                                                    
  ██████╗  █████╗ ██╗      █████╗ ███╗   ██╗ ██████╗███████╗███████╗
  ██╔══██╗██╔══██╗██║     ██╔══██╗████╗  ██║██╔════╝██╔════╝██╔════╝
  ██████╔╝███████║██║     ███████║██╔██╗ ██║██║     █████╗  ███████╗
  ██╔══██╗██╔══██║██║     ██╔══██║██║╚██╗██║██║     ██╔══╝  ╚════██║
  ██████╔╝██║  ██║███████╗██║  ██║██║ ╚████║╚██████╗███████╗███████║
  ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝╚══════╝╚══════╝
  */

  // checks to see whether an account has the expected value for kittyCoinCount
  function checkAccountKittyCoinCount (account, expectedValue) {
    it('account[' + account + '] should have a kittyCoinCount equal to ' + expectedValue, function (done) {
      KittyCoinClub.deployed().then(function (instance) {
        instance.kittyCoinCount(accounts[account]).then(function (kittyCoinCount) {
          assert.equal(kittyCoinCount.valueOf(), expectedValue
            , 'account[' + account + ']\'s kittyCoinCount is not ' + expectedValue);
        }).then(done).catch(done);
      });
    });
  };

  // checks to see whether an account has the expected value for donationCount
  function checkAccountDonationCount (account, expectedValue) {
    it('account[' + account + '] should have a donationCount equal to ' + expectedValue, function (done) {
      KittyCoinClub.deployed().then(function (instance) {
        instance.donationCount(accounts[account]).then(function (donationCount) {
          assert.equal(donationCount.valueOf(), expectedValue
            , 'account[' + account + ']\'s donationCount is not ' + expectedValue);
        }).then(done).catch(done);
      });
    });
  };

  // checks to see whether an account has the expected value for kittyCount
  function checkAccountKittyCount (account, expectedValue) {
    it('account[' + account + '] should have a kittyCount equal to ' + expectedValue, function (done) {
      KittyCoinClub.deployed().then(function (instance) {
        instance.kittyCount(accounts[account]).then(function (kittyCount) {
          assert.equal(kittyCount.valueOf(), expectedValue
            , 'account[' + account + ']\'s kittyCount is not ' + expectedValue);
        }).then(done).catch(done);
      });
    });
  };

  // checks to see whether an account has the expected value for pendingWithdrawals
  function checkPendingWithdrawals (account, expectedValueInEth) {
    var expectedValue = web3.toWei(expectedValueInEth, 'ether');
    it('account[' + account + '] should have pendingWithdrawals equal to ' + expectedValue, function (done) {
      KittyCoinClub.deployed().then(function (instance) {
        instance.pendingWithdrawals(accounts[account]).then(function (pendingWithdrawals) {
          assert.equal(pendingWithdrawals.valueOf(), expectedValue
            , 'account[' + account + ']\'s pendingWithdrawals is not ' + expectedValue);
        }).then(done).catch(done);
      });
    });
  };

  // checks to see whether the withdrawing account is credited with ether equal to pendingWithdrawals
  function checkWithdraw (account, expectedDifferenceInEth) {
    // var expectedDifference = web3.toWei(expectedDifferenceInEth, 'ether');
    it('should withdraw funds from account[' + account + ']', function (done) {
      KittyCoinClub.deployed().then(function (instance) {
        instance.pendingWithdrawals(accounts[account]).then(function (pendingWithdrawals) {
          var initialBalance = web3.eth.getBalance(accounts[account]);
          instance.withdraw({ from: accounts[account] }).then(function (tx) {
            var txReceipt = web3.eth.getTransaction(tx.tx);
            var gasPrice = txReceipt.gasPrice;
            var gasUsed = tx.receipt.gasUsed;
            var gasCost = gasPrice.times(gasUsed);
            var finalBalance = web3.eth.getBalance(accounts[account]);
            // console.log('initial:', initialBalance.toString()
            //   , 'final:', finalBalance.toString()
            //   , 'withdrawal:', pendingWithdrawals.toString()
            //   , finalBalance.minus(initialBalance).plus(gasCost).valueOf());
            assert.equal(finalBalance.minus(initialBalance).plus(gasCost).valueOf(), pendingWithdrawals.valueOf()
              , 'pendingWithdrawals was not deposited in account[' + account + ']');
          }).then(done).catch(done);
        });
      });
    });
  };

  /*
   ████████╗██████╗ ██╗   ██╗███████╗████████╗                                                     
   ╚══██╔══╝██╔══██╗██║   ██║██╔════╝╚══██╔══╝                                                     
      ██║   ██████╔╝██║   ██║███████╗   ██║                                                        
      ██║   ██╔══██╗██║   ██║╚════██║   ██║                                                        
      ██║   ██║  ██║╚██████╔╝███████║   ██║                                                        
      ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚══════╝   ╚═╝                                                        
                                                                                                    
    ███╗   ███╗ █████╗ ███╗   ██╗██╗██████╗ ██╗   ██╗██╗      █████╗ ████████╗██╗ ██████╗ ███╗   ██╗
    ████╗ ████║██╔══██╗████╗  ██║██║██╔══██╗██║   ██║██║     ██╔══██╗╚══██╔══╝██║██╔═══██╗████╗  ██║
    ██╔████╔██║███████║██╔██╗ ██║██║██████╔╝██║   ██║██║     ███████║   ██║   ██║██║   ██║██╔██╗ ██║
    ██║╚██╔╝██║██╔══██║██║╚██╗██║██║██╔═══╝ ██║   ██║██║     ██╔══██║   ██║   ██║██║   ██║██║╚██╗██║
    ██║ ╚═╝ ██║██║  ██║██║ ╚████║██║██║     ╚██████╔╝███████╗██║  ██║   ██║   ██║╚██████╔╝██║ ╚████║
    ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝╚═╝      ╚═════╝ ╚══════╝╚═╝  ╚═╝   ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝
  */

  // checks that we can apply trust status to an account
  function checkCanApplyTrustToAccount (accountTo, accountFrom, fail) {
    if (fail) {
      it('should not make account[' + accountTo + '] a trust from account[' + accountFrom + ']', function (done) {
        KittyCoinClub.deployed().then(function (instance) {
          instance.createTrust(accountTo, { from: accounts[accountFrom] }).catch(function (error) {
            assert.equal(error.toString(), errorMessage, 'not the correct error message');
          }).then(done).catch(done);
        });
      });
    } else {
      it('should make account[' + accountTo + '] a trust from account[' + accountFrom + ']', function (done) {
        KittyCoinClub.deployed().then(async function (instance) {
          await instance.createTrust(accountTo, { from: accounts[accountFrom] })
            .then(function (result) {
              assert.include(result.logs[0].event, 'NewTrust', 'NewTrust event was not triggered');
            });
        }).then(done).catch(done);
      });
    };
  };

  return {
    /** Token Details */
    checkAddsUpToTotalSupply: checkAddsUpToTotalSupply,
    checksTotalSupply: checksTotalSupply,
    checkRemainingFounderCoins: checkRemainingFounderCoins,
    checkRemainingKittyCoins: checkRemainingKittyCoins,
    checkTokenVariables: checkTokenVariables,
    /** Account / Contract Balances */
    checkAccountKittyCoinCount: checkAccountKittyCoinCount,
    checkAccountDonationCount: checkAccountDonationCount,
    checkAccountKittyCount: checkAccountKittyCount,
    checkPendingWithdrawals: checkPendingWithdrawals,
    checkWithdraw: checkWithdraw,
    /** Trust Manipulation */
    checkCanApplyTrustToAccount: checkCanApplyTrustToAccount,
  };
};
