
App = {
  
web3Provider:null,
contracts:{},
account:'0x0',
loading:false,
tokenPrice:1000000000000000000,
tokensSold:0,
tokensAvailable:750000,



init: function() {
    console.log("App initialized...")
   return App.initWeb3();
  },

  initWeb3: function() {
    if (typeof web3 !== 'undefined') {
      console.log("provider", web3.currentProvider);
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
      web3 = new Web3(App.web3Provider);
    }

    return App.initContracts();

  },

initContracts:function(){
  $.getJSON("GEO_AspYre_CoinSale.json",function(GEO_AspYre_CoinSale){
  App.contracts.GEO_AspYre_CoinSale =TruffleContract(GEO_AspYre_CoinSale);
  App.contracts.GEO_AspYre_CoinSale.setProvider(App.web3Provider);
  App.contracts.GEO_AspYre_CoinSale.deployed().then(function(GEO_AspYre_CoinSale){
console.log("GEO_AspYre_CoinSale Address:" ,GEO_AspYre_CoinSale.address);
});
  }).done(function(){
    $.getJSON("GEO_AspYre_Coin.json",function(GEO_AspYre_Coin){
      App.contracts.GEO_AspYre_Coin =TruffleContract(GEO_AspYre_Coin);
  App.contracts.GEO_AspYre_Coin.setProvider(App.web3Provider);
  App.contracts.GEO_AspYre_Coin.deployed().then(function(GEO_AspYre_Coin){
console.log("GEO_AspYre_Coin Address:" ,GEO_AspYre_Coin.address);

   
});
  App.listenForEvents();
return App.render();
  });

  });
},

//Listen for events emitted from the contract

listenForEvents:function(){
  App.contracts.GEO_AspYre_CoinSale.deployed().then(function(instance){
instance.Sell({},{
fromBlock:0,
toBlock:'latest',


}).watch(function(error, event){

  console.log("event triggered",event );
  App.render();
})

  })
},

render:function(){
  if(App.loading){
    return;
  }
  App.loading= true;

  var loader=$('#loader');
  var content =$('#content');


loader.show();
loader.hide();

  //load account data
web3.eth.getCoinbase(function(err ,account){
  if(err===null){
    console.log("account",account);
    App.account=account;
    $('#accountAddress').html("Your Account : "+account);
  }
})
//load token sale contrac
App.contracts.GEO_AspYre_CoinSale.deployed().then(function(instance){
GEO_AspYre_CoinSaleInstance = instance;
return GEO_AspYre_CoinSaleInstance.tokenPrice();
}).then(function(tokenPrice){
  App.tokenPrice=tokenPrice;
  $('.token-Price').html(web3.fromWei(App.tokenPrice ,"ether").toNumber());
  return GEO_AspYre_CoinSaleInstance.tokensSold();
}).then(function(tokensSold){
App.tokensSold = tokensSold.toNumber();
$('.tokens-sold').html(App.tokensSold);
$('.tokens-available').html(App.tokensAvailable)

var progressPercent=(Math.ceil (App.tokensSold)/App.tokensAvailable)*100;
$('#progress').css('width', progressPercent, +'%');

//load token contracts
App.contracts.GEO_AspYre_Coin.deployed().then(function(instance){
GEO_AspYre_CoinInstance=instance;
return GEO_AspYre_CoinInstance.balanceOf(App.account);

}).then(function(balance){
  $('.dapp-balance').html(balance.toNumber());
   App.loading=false;
  loader.hide();
  content.show();
})




});

 


},
buyTokens:function(){
$('#content').hide();
$('#loader').show();
   var numberOfTokens = $('#numberOfTokens').val();
App.contracts.GEO_AspYre_CoinSale.deployed().then(function(instance){
return instance.buyTokens(numberOfTokens,{
from  : App.account,
value :numberOfTokens * App.tokenPrice,
gas: 500000

});

}).then(function(result){
  console.log("Tokens bought...")
   $('form').trigger('reset')//reset number of tokens in form
 //wait for sell event

})


}


}

$(function() {
  $(window).load(function() {
    App.init();
  })
});
