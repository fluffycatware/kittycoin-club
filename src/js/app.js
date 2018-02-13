/** Updates the trust address field with the users address. */
function populateUserData () {
  if (typeof web3 !== 'undefined') {
    var account = web3.eth.defaultAccount;
    if (account) {
      $('#inputTrustAddress').val(account);
    } else {
      window.location.assign("sign-in.html");
    }
  }
}

/** Generates a random kitty for the display canvas */
function randomKitty() {
  generateKittyCoinImage(generateRandomCoinImageHex(), 10);
}

/** Randomizes a 5byte hex value for the kitty generation */
function generateRandomCoinImageHex() {
  var output_string = "0x00" +
    Math.floor(Math.random() * 255).toString(16) +
    Math.floor(Math.random() * 255).toString(16) +
    Math.floor(Math.random() * 255).toString(16) +
    Math.floor(Math.random() * 255).toString(16);
  $('#randKittyId').val(output_string);
  return output_string;
}

/**
 * Using the random 5 byte hex value, this generates and 
 * displays the kitty image.
 * @param {string} catId - Id of the kitty to display.
 * @param {int} size - Scale size of the kitty image.
 */
function generateKittyCoinImage(catId, size) {
  size = size || 10;
  var data = kittycoinparser(catId);
  var canvas = document.getElementById('kitty-canvas');
  canvas.width = size * data.length;
  canvas.height = size * data[1].length;
  var ctx = canvas.getContext('2d');

  for (var i = 0; i < data.length; i++) {
    for (var j = 0; j < data[i].length; j++) {
      var color = data[i][j];
      if (color) {
        ctx.fillStyle = color;
        ctx.fillRect(i * size, j * size, size, size);
      }
    }
  }
  return canvas.toDataURL();
}

/** Using the json definitions, load in sample kitties */
function loadKittiesFromJson() {
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
}

var App = {
  contracts: {},

  init() {
    loadKittiesFromJson();
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

      // User our contract to retrieve the kitties that can be donated to
      return App.loadKitties();
    });
    return App.bindEvents();
  },

  loadKitties() {
    let kittyCoinClubInstance;

    App.contracts.KittyCoinClub.deployed().then((instance) => {
      kittyCoinClubInstance = instance;

      return kittyCoinClubInstance.getKitties.call();
    }).then((kitties) => {
      for (var i = 0; i < kitties.length; i++) {
        if (kitties[i] !== '0x0000000000000000000000000000000000000000') {
          console.log(kitties[i]);
        }
      }
    }).catch((err) => {
      console.log(err.message);
    });
  },

  loadDonations() {
    let kittyCoinClubInstance;

    App.contracts.KittyCoinClub.deployed().then((instance) => {
      kittyCoinClubInstance = instance;

      return kittyCoinClubInstance.getDonations.call();
    }).then((donations) => {
      for (var i = 0; i < donations.length; i++) {
        if (donations[i] !== '0x0000000000000000000000000000000000000000') {
          console.log(donations[i]);
        }
      }
    }).catch((err) => {
      console.log(err.message);
    });
  },

  /** Event Bindings for Form submits */
  bindEvents() {
    $(document).on('submit', 'form.donate-kitty', App.handleDonation);
    $(document).on('submit', 'form.create-kitty', App.handleCreateKitty);
    $(document).on('submit', 'form.create-trust', App.handleCreateTrust);
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
      }).then(result => App.loadDonations()).catch((err) => {
        console.log(err.message);
      });
    });
  },

  handleCreateKitty (event) {
    event.preventDefault();
  
    // Get the form fields
    var kittyName = $(event.target.elements)[0].value;
    var kittyId = $(event.target.elements)[1].value;
    var trustAddress = $(event.target.elements)[2].value;
    var fosterAddress = $(event.target.elements)[3].value;
    var donationCap = parseFloat($(event.target.elements)[4].value);

    var kittyCoinClubInstance;

    web3.eth.getAccounts((error, accounts) => {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.KittyCoinClub.deployed().then((instance) => {
        kittyCoinClubInstance = instance;

        // Execute create kitty function
        var donateCap = web3.toWei(donationCap, "ether");
        return kittyCoinClubInstance.createKitty(fosterAddress, kittyId, donationCap, {
          from: account,
        });
      }).then(result => App.loadKitties()).catch((err) => {
        console.log(err.message);
      });
    });
  },

  handleCreateTrust (event) {
    event.preventDefault();
  
    // Get the form fields
    var trustAddress = $(event.target.elements)[0].value;

    var kittyCoinClubInstance;

    web3.eth.getAccounts((error, accounts) => {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.KittyCoinClub.deployed().then((instance) => {
        kittyCoinClubInstance = instance;

        // Execute create trust function
        return kittyCoinClubInstance.createTrust(trustAddress, {
          from: account,
        });
      }).then().catch((err) => {
        console.log(err.message);
      });
    });
  }
};

jQuery(document).ready(
  function ($) {
    App.init();
    populateUserData();
    randomKitty();
  }
);