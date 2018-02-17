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
  function checkTokenVariables (tokenName, tokenSymbol) {
    it('token should have the name ' + tokenName + 
      ', symbol ' + tokenSymbol, function (done) {
      KittyCoinClub.deployed().then(function (instance) {
        instance.name.call().then(function (_tokenName) {
          instance.symbol.call().then(function (_tokenSymbol) {
            assert.equal(_tokenName, tokenName, 'tokenName does not equal ' + tokenName);
            assert.equal(_tokenSymbol, tokenSymbol, 'tokenSymbol does not equal ' + tokenSymbol);
          }).then(done).catch(done);
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
  function checkPendingWithdrawals (account, expectedValue) {
    it('account[' + account + '] should have pendingWithdrawals equal to ' + expectedValue, function (done) {
      KittyCoinClub.deployed().then(function (instance) {
        instance.pendingWithdrawals(accounts[account]).then(function (pendingWithdrawals) {
          assert.equal(
            web3.fromWei(pendingWithdrawals.valueOf(), 'ether'),
            expectedValue
            , 'account[' + account + ']\'s pendingWithdrawal: ' + 
            web3.fromWei(pendingWithdrawals.valueOf(), 'ether') + ' is not ' + expectedValue);
        }).then(done).catch(done);
      });
    });
  };

  // checks to see whether the withdrawing account is credited with ether equal to pendingWithdrawals
  function checkWithdraw (account, expectedWithdrawEth) {
    var expectedWithdraw = web3.toWei(expectedWithdrawEth, 'ether');
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
            console.log(
              '\tinitialBalance: ', web3.fromWei(initialBalance, 'ether') + 
              '\n\tfinalBalance: ', web3.fromWei(finalBalance, 'ether') + 
              '\n\tpendingWithdrawal: ', web3.fromWei(pendingWithdrawals, 'ether') +
              '\n\twithdrawal: final(' + web3.fromWei(finalBalance, 'ether') + 
              ') - init(' + web3.fromWei(initialBalance, 'ether') + 
              ') + gas(' + web3.fromWei(gasCost, 'ether') + ') = ' + 
              web3.fromWei(finalBalance.minus(initialBalance).plus(gasCost), 'ether')
            );
            assert.equal(finalBalance.minus(initialBalance).plus(gasCost).valueOf(), pendingWithdrawals.valueOf()
              , 'pendingWithdrawals was not deposited in account[' + account + ']');
            assert.equal(finalBalance.minus(initialBalance).plus(gasCost).valueOf(), expectedWithdraw
              , 'expectedWithdraw was not equal to actual withdraw in account[' + account + ']');
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
              const trustAddress = logs.trustAddress;
              const fosterAddress = logs.fosterAddress;
              const traitSeed = logs.traitSeed;
              const donateCap = logs.donationCap;
              console.log(
                '\tkittyId: ' + kittyId +
                '\n\t  trustAddress: ' + trustAddress +
                '\n\t  fosterAddress: ' + fosterAddress +
                '\n\t  traitsId: ' + web3.toHex(traitSeed) +
                '\n\t  donationCap: ' + web3.fromWei(donateCap, 'ether')
              );
            });
        }).then(done).catch(done);
      });
    };
  };

  // checks the total number of kitties
  function checkKittyAggregator (numberOfKitties, fail) {
    if (fail) {
      it('should verify the number of kitties is not ' + numberOfKitties, function (done) {
        KittyCoinClub.deployed().then(async function (instance) {
          await instance.getKitties()
            .then(function (result) {
              assert.notEqual(result.length, numberOfKitties, 
                'kitty count is ' + 
                result.length + ' which equels the expected ' + 
                numberOfKitties + ' kitties');
            });
        }).then(done).catch(done);
      });
    } else {
      it('should verify the number of kitties is ' + numberOfKitties, function (done) {
        KittyCoinClub.deployed().then(async function (instance) {
          await instance.getKitties()
            .then(function (result) {
              assert.equal(result.length, numberOfKitties, 
                'kitty count is ' + 
                result.length + ' and not the expected ' + 
                numberOfKitties + ' kitties');
            });
        }).then(done).catch(done);
      });
    };
  };

  // checks the data for a given kitty
  function checkKitty (kittyId, isEnabled, trust, foster, traitSeed, donationCap, fail) {
    if (fail) {
      it('should not verify kittyId[' + kittyId + 
      '] isEnabled: ' + isEnabled + 
      ', trustAddress: ' + accounts[trust] + 
      ', fosterAddress: ' + accounts[foster] + 
      ', traitSeed: ' + traitSeed + 
      ', donationCap: ' + donationCap, function (done) {
        KittyCoinClub.deployed().then(async function (instance) {
          await instance.getKitty(kittyId)
            .then(function (result) {
              assert.notEqual(result[0], isEnabled, 'isEnabled does equal ' + isEnabled);
              assert.notEqual(result[1], accounts[trust], 'trustAddress does equal ' + accounts[trust]);
              assert.notEqual(result[2], accounts[foster], 'fosterAddress does equal ' + accounts[foster]);
              assert.notEqual(result[3], traitSeed, 'traitSeed does equal ' + traitSeed);
              assert.notEqual(web3.fromWei(result[4], 'ether'), donationCap, 
                'donationCap: ' + donationCap + ' does equal ' + web3.fromWei(result[4], 'ether'));
            });
        }).then(done).catch(done);
      });
    } else {
      it('should verify kittyId[' + kittyId + 
      '] isEnabled: ' + isEnabled + 
      ', trustAddress: ' + accounts[trust] + 
      ', fosterAddress: ' + accounts[foster] + 
      ', traitSeed: ' + traitSeed + 
      ', donationCap: ' + donationCap, function (done) {
        KittyCoinClub.deployed().then(async function (instance) {
          await instance.getKitty(kittyId)
            .then(function (result) {
              assert.equal(result[0], isEnabled, 'isEnabled does not equal ' + isEnabled);
              assert.equal(result[1], accounts[trust], 'trustAddress does not equal ' + accounts[trust]);
              assert.equal(result[2], accounts[foster], 'fosterAddress does not equal ' + accounts[foster]);
              assert.equal(result[3], traitSeed, 'traitSeed does not equal ' + traitSeed);
              assert.equal(web3.fromWei(result[4], 'ether'), donationCap, 
                'donationCap: ' + donationCap + ' does not equal ' + web3.fromWei(result[4], 'ether'));
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

  // checks the total number of donations
  function checkDonationAggregator (numberOfDonations, fail) {
    if (fail) {
      it('should verify the number of donations is not ' + numberOfDonations, function (done) {
        KittyCoinClub.deployed().then(async function (instance) {
          await instance.getDonations()
            .then(function (result) {
              assert.notEqual(result.length, numberOfDonations, 
                'donation count is ' + 
                result.length + ' which equels the expected ' + 
                numberOfDonations + ' donations');
            });
        }).then(done).catch(done);
      });
    } else {
      it('should verify the number of donations is ' + numberOfDonations, function (done) {
        KittyCoinClub.deployed().then(async function (instance) {
          await instance.getDonations()
            .then(function (result) {
              assert.equal(result.length, numberOfDonations, 
                'donation count is ' + 
                result.length + ' and not the expected ' + 
                numberOfDonations + ' donations');
            });
        }).then(done).catch(done);
      });
    };
  };

  // checks the data for a given donation
  function checkDonation (donationId, kittyId, trust, foster, trustAmount, fosterAmount, fail) {
    if (fail) {
      it('should not verify donationId[' + donationId + 
      '] kittyId: ' + kittyId + 
      ', trustAddress: ' + accounts[trust] + 
      ', fosterAddress: ' + accounts[foster] + 
      ', trustAmount: ' + trustAmount + 
      ', fosterAmount: ' + fosterAmount, function (done) {
        KittyCoinClub.deployed().then(async function (instance) {
          await instance.getDonation(donationId)
            .then(function (result) {
              assert.notEqual(result[0], kittyId, 'kittyId does equal ' + kittyId);
              assert.notEqual(result[1], accounts[trust], 'trustAddress does equal ' + accounts[trust]);
              assert.notEqual(result[2], accounts[foster], 'fosterAddress does equal ' + accounts[foster]);
              assert.notEqual(web3.fromWei(result[3], 'ether'), trustAmount, 
                'trustAmount: ' + trustAmount + ' does equal ' + web3.fromWei(result[3], 'ether'));
              assert.notEqual(web3.fromWei(result[4], 'ether'), fosterAmount, 
                'fosterAmount: ' + fosterAmount + ' does equal ' + web3.fromWei(result[4], 'ether'));
            });
        }).then(done).catch(done);
      });
    } else {
      it('should verify donationId[' + donationId + 
      '] kittyId: ' + kittyId + 
      ', trustAddress: ' + accounts[trust] + 
      ', fosterAddress: ' + accounts[foster] + 
      ', trustAmount: ' + trustAmount + 
      ', fosterAmount: ' + fosterAmount, function (done) {
        KittyCoinClub.deployed().then(async function (instance) {
          await instance.getDonation(donationId)
            .then(function (result) {
              assert.equal(result[0], kittyId, 'kittyId does not equal ' + kittyId);
              assert.equal(result[1], accounts[trust], 'trustAddress does not equal ' + accounts[trust]);
              assert.equal(result[2], accounts[foster], 'fosterAddress does not equal ' + accounts[foster]);
              assert.equal(web3.fromWei(result[3], 'ether'), trustAmount, 
                'trustAmount: ' + trustAmount + ' does not equal ' + web3.fromWei(result[3], 'ether'));
              assert.equal(web3.fromWei(result[4], 'ether'), fosterAmount, 
                'fosterAmount: ' + fosterAmount + ' does not equal ' + web3.fromWei(result[4], 'ether'));
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
    checkKittyAggregator: checkKittyAggregator,
    checkKitty: checkKitty,
    /** Donation */
    checkCanCreateDonation: checkCanCreateDonation,
    checkNumberOfDonationsForDonator: checkNumberOfDonationsForDonator,
    checkDonationAggregator: checkDonationAggregator,
    checkDonation: checkDonation,
    /** KittyCoin */
  };
};
