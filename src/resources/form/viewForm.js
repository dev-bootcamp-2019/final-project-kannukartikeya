//  Web3 and contract intializer

var web3Provider = null ;

init();

function init(){
initWeb3();
initContract();
}

function initWeb3(){
	
	if (typeof web3 !== 'undefined') {
         // First, we check if there's a web3 instance already active.
         // Ethereum browsers like Mist or Chrome with the MetaMask extension
         // will inject their own web3 instances.
         // If an injected web3 instance is present,
         // we get its provider and use it to create our web3 object.
         //web3Provider = web3.currentProvider;
		//overriding this since metamask is already installed however we are using truffle provider
		 web3Provider = new web3.providers.HttpProvider('http://localhost:8545');
     } else {
         // If no injected web3 instance is present,
         // we create our web3 object based on the TestRPC's provider.
         // Note this fallback is fine for development environments,
         // but insecure and not suitable for production.
         web3Provider = new web3.providers.HttpProvider('http://localhost:8545');
     }
web3 = new Web3(web3Provider);
	
}

var kycContract = null;

function initContract() {
    $.getJSON('/build/contracts/kyc.json', function (data) {
        // create contract interface using json data
        kycContract= TruffleContract(data);

        // set contract provider
        kycContract.setProvider(web3Provider);
})
	.then(function(result){
		fillForm();
	})
}

//  account to make all transactions

var current_account = localStorage.bank_eth_account;
var user_name = localStorage.user_name_v;

//  function to fill customer data in form

function fillForm() {
	
	   kycContract.deployed().then(function(kycInstance) {
          return kycInstance.viewCustomer.call(user_name,{from: current_account,gas: 4700000});
        })
      .then(function(oldData) {
   			 var toFill = "";
    		 for (var i = 0, j = 0; i < (oldData.length - 2); ++i) {
       		 if (oldData[i] == '!' && oldData[i + 1] == '@' && oldData[i + 2] == '#') {
           		 if (j == 9) {
              		  document.getElementById("gender_m").innerHTML = toFill;
             		   j += 2;
            		   i += 2;
           		      toFill = "";
           		     continue;
          		  }
             if (toFill == "")
                toFill = "Null";
             document.getElementById(allIds[j]).innerHTML = toFill;
             toFill = "";
             j++;
             i += 2;
             continue;
       		 }
        		toFill = toFill + oldData[i];
    		}
    	  })
      .catch(function(err) {
         alert('viewCustomer call error!');
         console.log(err.message);
      });
	
    //var oldData = contractInstance.viewCustomer.call(user_name, {
      //  from: current_account,
        //gas: 4700000
    //});
    //  alert(oldData);
	
	
	    kycContract.deployed().then(function(kycInstance) {
            return kycInstance.getCustomerRating.call(user_name,{from: current_account,gas: 4700000});
        })
        .then(function(result) {
            document.getElementById("customer_rating").innerHTML = result;
        })
        .catch(function(err) {
            alert('getCustomerRating error!');
            console.log(err.message);
        });
	
	
    //document.getElementById("customer_rating").innerHTML = contractInstance.getCustomerRating.call(user_name, {
      //from: current_account,
        //gas: 4700000
    //}) / 100;

        kycContract.deployed().then(function(kycInstance) {
            return kycInstance.getCustomerBankName.call(user_name,{from: current_account,gas: 4700000});
        })
        .then(function(result) {
             document.getElementById("bank_name").innerHTML= result;
        })
        .catch(function(err) {
            alert('getCustomerBankName error!');
            console.log(err.message);
        });
	
	
   // document.getElementById("bank_name").innerHTML = contractInstance.getCustomerBankName.call(user_name, {
     //   from: current_account,
       // gas: 4700000
    //});
	
	    kycContract.deployed().then(function(kycInstance) {
            return kycInstance.getCustomerBankRating.call(user_name,{from: current_account,gas: 4700000});
        })
        .then(function(result) {
           document.getElementById("bank_rating").innerHTML = result;
        })
        .catch(function(err) {
            alert('getCustomerBankRating error!');
            console.log(err.message);
        });
	
}

//  fill the KYC form

//fillForm();