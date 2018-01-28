// Updates the trust address field with the users address
function populateUserData () {
  if (typeof web3 !== 'undefined') {
    var account = web3.eth.defaultAccount;
    if (account) {
      $('#inputTrustAddress').val(account);
    }
  }
}
$(document).ready(populateUserData);
