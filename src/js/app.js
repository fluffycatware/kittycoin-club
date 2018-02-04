var App = {
  contracts: {},

  init() {
    // Load kitties.
    $.getJSON('../kitties.json', (data) => {
      const kittyRow = $('#kitty-row');
      const kittyTemplate = $('#kitty-template');

      for (var i = 0; i < data.length; i++) {
        kittyTemplate.find('.card-title').text(data[i].name);
        kittyTemplate.find('.card-img-top').attr('src', data[i].picture);
        kittyTemplate.find('.card-text').text(data[i].description);
        kittyTemplate.find('.btn-donate').attr('data-id', data[i].id);

        kittyRow.append(kittyTemplate.html());
      }
    });

    return App.initWeb3();
  },

  initWeb3() {
    if (typeof web3 !== 'undefined') {
      web3 = new Web3(web3.currentProvider);
    } else {
      // set the provider you want from Web3.providers
      web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    }

    return App.initContract();
  },

  initContract() {
    $.getJSON('KittyCoinClub.json', (data) => {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      const KittyCoinClubArtifact = data;
      App.contracts.KittyCoinClub = TruffleContract(KittyCoinClubArtifact);

      // Set the provider for our contract
      App.contracts.KittyCoinClub.setProvider(web3.currentProvider);

      // User our contract to retrieve the kitties with donations
      return App.markDonatedTo();
    });

    return App.bindEvents();
  },

  bindEvents () {
    $(document).on('submit', 'form.donate-kitty', App.handleDonation);
  },

  markDonatedTo(donations, account) {
    let kittyCoinClubInstance;

    App.contracts.KittyCoinClub.deployed().then((instance) => {
      kittyCoinClubInstance = instance;

      return kittyCoinClubInstance.getDonations.call();
    }).then((donations) => {
      for (var i = 0; i < donations.length; i++) {
        if (donations[i] !== '0x0000000000000000000000000000000000000000') {
          $('.card-kitty').eq(i).find('button').text('Success').attr('disabled', true);
        }
      }
    }).catch((err) => {
      console.log(err.message);
    });
  },

  handleDonation(event) {
    event.preventDefault();

    // Get the form fields
    var kittyId = parseInt($(event.target.elements).closest('.btn-donate').data('id'));
    var donationAmount = parseFloat($(event.target.elements)[0].value);
    var donationRatio = parseInt($(event.target.elements)[2].value);

    var kittyCoinClubInstance;

    web3.eth.getAccounts((error, accounts) => {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.KittyCoinClub.deployed().then((instance) => {
        kittyCoinClubInstance = instance;

        // Execute donate as a transaction by sending account
        var price = web3.toWei(donationAmount, "ether");
        return kittyCoinClubInstance.makeDonation(kittyId, price, donationRatio, {
          from: account,
          value: price,
        });
      }).then(result => App.markDonatedTo()).catch((err) => {
        console.log(err.message);
      });
    });
  },

};

jQuery(document).ready(
  function ($) {
    App.init();
  }
);