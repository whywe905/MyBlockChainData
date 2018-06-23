var GEO_AspYre_Coin = artifacts.require("./GEO_AspYre_Coin.sol");
var GEO_AspYre_CoinSale = artifacts.require("./GEO_AspYre_CoinSale.sol");

module.exports = function(deployer) {
  deployer.deploy(GEO_AspYre_Coin, 1000000).then(function() {
    // Token price is 0.001 Ether
    var tokenPrice = 1000000000000000;
    return deployer.deploy(GEO_AspYre_CoinSale, GEO_AspYre_Coin.address, tokenPrice);
  });
};