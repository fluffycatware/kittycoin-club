export function getBalance (web3, address) {
  return new Promise(function (resolve, reject) {
    web3.eth.getBalance(address, function (error, result) {
      if (error) reject(error);
      else resolve(web3.fromWei(result.toNumber(), 'ether'));
    });
  });
}
