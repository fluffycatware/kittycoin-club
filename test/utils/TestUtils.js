module.exports = function (KittyCoinClub, accounts) {
  var errorMessage = 'Error: VM Exception while processing transaction: revert';

  /* Doom (http://patorjk.com/software/taag)
   _____     _                
  |_   _|   | |               
    | | ___ | | _____ _ __    
    | |/ _ \| |/ / _ \ '_ \   
    | | (_) |   <  __/ | | |  
    \_/\___/|_|\_\___|_| |_|  
  ______     _        _ _     
  |  _  \   | |      (_) |    
  | | | |___| |_ __ _ _| |___ 
  | | | / _ \ __/ _` | | / __|
  | |/ /  __/ || (_| | | \__ \
  |___/ \___|\__\__,_|_|_|___/
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

  // checks to make sure all token variables are correctly instantiated
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
    ___                            _       
   / _ \                          | |      
  / /_\ \ ___ ___ ___  _   _ _ __ | |_     
  |  _  |/ __/ __/ _ \| | | | '_ \| __|    
  | | | | (_| (_| (_) | |_| | | | | |_     
  \_| |_/\___\___\___/ \__,_|_| |_|\__|    
  ______       _                           
  | ___ \     | |                          
  | |_/ / __ _| | __ _ _ __   ___ ___  ___ 
  | ___ \/ _` | |/ _` | '_ \ / __/ _ \/ __|
  | |_/ / (_| | | (_| | | | | (_|  __/\__ \
  \____/ \__,_|_|\__,_|_| |_|\___\___||___/
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
   _____              _   
  |_   _|            | |  
    | |_ __ _   _ ___| |_ 
    | | '__| | | / __| __|
    | | |  | |_| \__ \ |_ 
    \_/_|   \__,_|___/\__|                                   
  */
  // checks that we can apply trust status to an account
  function checkCanApplyTrustToAccount (accountTo, accountFrom, fail) {
    if (fail) {
      it('should not make account[' + accountTo + '] a trust from account[' + accountFrom + ']', function (done) {
        KittyCoinClub.deployed().then(function (instance) {
          instance.createTrust(accounts[accountTo], { from: accounts[accountFrom] }).catch(function (error) {
            assert.equal(error.toString(), errorMessage, 'not the correct error message');
          }).then(done).catch(done);
        });
      });
    } else {
      it('should make account[' + accountTo + '] a trust from account[' + accountFrom + ']', function (done) {
        KittyCoinClub.deployed().then(async function (instance) {
          await instance.createTrust(accounts[accountTo], { from: accounts[accountFrom] })
            .then(function (result) {
              assert.include(result.logs[0].event, 'NewTrust', 'NewTrust event was not triggered');
            });
        }).then(done).catch(done);
      });
    };
  };

  // checks that a given account is a trust
  function checkAccountIsTrust (account, fail) {
    if (fail) {
      it('should verify account[' + account + '] is not a trust', function (done) {
        KittyCoinClub.deployed().then(async function (instance) {
          await instance.isTrustAddress(accounts[account])
            .then(function (result) {
              assert.equal(result, false, 'account[' + account + '] is a trust');
            });
        }).then(done).catch(done);
      });
    } else {
      it('should verify account[' + account + '] is a trust', function (done) {
        KittyCoinClub.deployed().then(async function (instance) {
          await instance.isTrustAddress(accounts[account])
            .then(function (result) {
              assert.equal(result, true, 'account[' + account + '] is not a trust');
            });
        }).then(done).catch(done);
      });
    };
  };

  // checks that a given account is a trust
  function checkChangeTrustAddress (trustId, accountTo, accountFrom, fail) {
    if (fail) {
      it('should verify trustId[' + trustId + '] is not transfered to account[' + accountTo + 
      '] from account[' + accountFrom + ']', function (done) {
        KittyCoinClub.deployed().then(function (instance) {
          instance.changeTrustAddress(trustId, accounts[accountTo], { from: accounts[accountFrom] })
            .catch(function (error) {
              assert.equal(
                error.toString(), errorMessage, 'not the correct error message');
            }).then(done).catch(done);
        });
      });
    } else {
      it('should verify trustId[' + trustId + '] is transfered to account[' + accountTo + 
      '] from account[' + accountFrom + ']', function (done) {
        KittyCoinClub.deployed().then(async function (instance) {
          await instance.changeTrustAddress(trustId, accounts[accountTo], { from: accounts[accountFrom] })
            .then(function (result) {
              assert.include(
                result.logs[0].event, 'ChangedTrustAddress', 'ChangedTrustAddress event was not triggered');
            });
        }).then(done).catch(done);
      });
    };
  };

  /*
   _   ___ _   _         
  | | / (_) | | |        
  | |/ / _| |_| |_ _   _ 
  |    \| | __| __| | | |
  | |\  \ | |_| |_| |_| |
  \_| \_/_|\__|\__|\__, |
                    __/ |
                   |___/ 
  */
  // checks that we can create a new kitty as a trust
  function checkCanCreateKitty (accountFoster, traitSeed, donationCap, accountFrom, fail) {
    if (fail) {
      it('should not make kitty with trait[' + 
      traitSeed + '] with trust account[' + 
      accountFrom + '] address and foster account[' + 
      accountFoster + '] address with a donation cap of ' + 
      donationCap + ' from account[' + 
      accountFrom + ']', function (done) {
        KittyCoinClub.deployed().then(function (instance) {
          var donationCapWei = web3.toWei(donationCap, 'ether');
          instance.createKitty(
            accounts[accountFoster],
            traitSeed,
            donationCapWei, {
              from: accounts[accountFrom],
            }).catch(function (error) {
            assert.equal(error.toString(), errorMessage, 'not the correct error message');
          }).then(done).catch(done);
        });
      });
    } else {
      it('should make kitty with trait[' + 
      traitSeed + '] with trust account[' + 
      accountFrom + '] address and foster account[' + 
      accountFoster + '] address with a donation cap of ' + 
      donationCap + ' from account[' + 
      accountFrom + ']', function (done) {
        KittyCoinClub.deployed().then(async function (instance) {
          var donationCapWei = web3.toWei(donationCap, 'ether');
          await instance.createKitty(
            accounts[accountFoster],
            traitSeed,
            donationCapWei, {
              from: accounts[accountFrom],
            })
            .then(function (result) {
              assert.include(result.logs[0].event, 'NewKitty', 'NewKitty event was not triggered');
              const logs = result.logs[0].args;
              const kittyId = logs.kittyId.toNumber();
              const traitSeed = logs.traitSeed;
              console.log(
                '\tkittyId: ' + kittyId +
                '\ttraitsId: ' + web3.toHex(traitSeed)
              );
            });
        }).then(done).catch(done);
      });
    };
  };

  /*
  ______                  _   _             
  |  _  \                | | (_)            
  | | | |___  _ __   __ _| |_ _  ___  _ __  
  | | | / _ \| '_ \ / _` | __| |/ _ \| '_ \ 
  | |/ / (_) | | | | (_| | |_| | (_) | | | |
  |___/ \___/|_| |_|\__,_|\__|_|\___/|_| |_|
  */
  // checks that donations can be made on kitties
  function checkCanCreateDonation (
    kittyId, amountTrust, amountFoster, amountTotal, accountFrom, fail) {
    if (fail) {
      it('should not donate towards kitty[' + kittyId + '] the value of ' + 
        amountTrust + 'eth and to trust and ' + 
        amountFoster + 'eth to foster from account[' + 
        accountFrom + ']', function (done) {
        KittyCoinClub.deployed().then(function (instance) {
          var amountTotalWei = web3.toWei(amountTotal, 'ether');
          var amountTrustWei = web3.toWei(amountTrust, 'ether');
          var amountFosterWei = web3.toWei(amountFoster, 'ether');
          instance.makeDonation(
            kittyId,
            amountTrustWei,
            amountFosterWei, { 
              from: accounts[accountFrom],
              value: amountTotalWei,
            }).catch(function (error) {
            assert.equal(error.toString(), errorMessage, 'not the correct error message');
          }).then(done).catch(done);
        });
      });
    } else {
      it('should donate towards kitty[' + kittyId + '] the value of ' + 
        amountTrust + ' eth and to trust and ' + 
        amountFoster + ' eth to foster from account[' + 
        accountFrom + ']', function (done) {
        KittyCoinClub.deployed().then(async function (instance) {
          var amountTotalWei = web3.toWei(amountTotal, 'ether');
          var amountTrustWei = web3.toWei(amountTrust, 'ether');
          var amountFosterWei = web3.toWei(amountFoster, 'ether');
          await instance.makeDonation(
            kittyId,
            amountTrustWei,
            amountFosterWei, { 
              from: accounts[accountFrom],
              value: amountTotalWei,
            })
            .then(function (result) {
              assert.include(result.logs[0].event, 'NewDonation', 'NewDonation event was not triggered');
            });
        }).then(done).catch(done);
      });
    };
  };

  // checks the number of donations for a given address
  function checkNumberOfDonationsForDonator (account, expectedDonations, fail) {
    if (fail) {
      it('should verify that account[' + account + '] does not have ' + 
      expectedDonations + ' donations', function (done) {
        KittyCoinClub.deployed().then(async function (instance) {
          await instance.getDonationsByDonator(accounts[account])
            .then(function (result) {
              assert.notEqual(result.length, expectedDonations, 
                'account[' + account + '] does have ' + expectedDonations + ' donations');
            });
        }).then(done).catch(done);
      });
    } else {
      it('should verify account[' + account + '] has ' + 
      expectedDonations + ' donations', function (done) {
        KittyCoinClub.deployed().then(async function (instance) {
          await instance.getDonationsByDonator(accounts[account])
            .then(function (result) {
              assert.equal(result.length, expectedDonations, 
                'account[' + account + '] does not have ' + expectedDonations + ' donations');
            });
        }).then(done).catch(done);
      });
    };
  };

  /*
   _   ___ _   _         _____       _       
  | | / (_) | | |       /  __ \     (_)      
  | |/ / _| |_| |_ _   _| /  \/ ___  _ _ __  
  |    \| | __| __| | | | |    / _ \| | '_ \ 
  | |\  \ | |_| |_| |_| | \__/\ (_) | | | | |
  \_| \_/_|\__|\__|\__, |\____/\___/|_|_| |_|
                    __/ |                    
                   |___/ 
  */

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
    /** Trust */
    checkCanApplyTrustToAccount: checkCanApplyTrustToAccount,
    checkAccountIsTrust: checkAccountIsTrust,
    checkChangeTrustAddress: checkChangeTrustAddress,
    /** Kitty */
    checkCanCreateKitty: checkCanCreateKitty,
    /** Donation */
    checkCanCreateDonation: checkCanCreateDonation,
    checkNumberOfDonationsForDonator: checkNumberOfDonationsForDonator,
    /** KittyCoin */

  };
};
