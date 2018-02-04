function init () {
  populateUserData();
  return bindEvents();
}

function bindEvents () {
  $(document).on('submit', 'form.create-kitty', createKitty);
}

// Updates the trust address field with the users address
function populateUserData () {
  if (typeof web3 !== 'undefined') {
    var account = web3.eth.defaultAccount;
    if (account) {
      $('#inputTrustAddress').val(account);
    }
  }
}

function createKitty (event) {
  event.preventDefault();

  // Get the form fields
  var kittyName = $(event.target.elements)[0].value;
  var kittyId = $(event.target.elements)[1].value;
  var trustAddress = $(event.target.elements)[2].value;
  var fosterAddress = $(event.target.elements)[3].value;
  var donationCap = parseFloat($(event.target.elements)[4].value);

  console.log(kittyName, kittyId, trustAddress, fosterAddress, donationCap);
}

jQuery(document).ready(
  function ($) {
    init();
  }
);
