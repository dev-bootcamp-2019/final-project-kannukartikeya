//  Web3 intializer
//  ABI definition, Binary Data and contract Address in contractDetails.js

//var web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
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

//var kycContract = web3.eth.contract(abi);
//var deployedContract = kycContract.new({
//    data: binaryData,
  //  from: web3.eth.accounts[0],
   // gas: 4700000
//});

var kycContract ;

//var contractInstance = kycContract.at(contractAddress);

function initContract() {
    $.getJSON('../build/contracts/kyc.json', function (data) {
        // create contract interface using json data
        kycContract= TruffleContract(data);

        // set contract provider
        kycContract.setProvider(web3Provider);
})
}

//  check if web storage is supported

if (typeof(Storage) == "undefined") {
    alert("Sorry, your browser does not support web storage. Upgrade to IE9 or contemporary platforms. Thank You for showing interest in us!");
}

//  function to execute on Sign up

function onSignUp() {
	

    var bank_name1 = document.getElementById("username").value;

    //  validate input

    if (bank_name1 == "") {
        alert("Enter a valid username!");
        return;
    }
    var pass = document.getElementById("password").value;
    if (pass == "") {
        alert("Enter a valid password!");
        return;
    }
    var reg = document.getElementById("reg_no").value;
    if (reg == "") {
        alert("Enter valid details");
        return;
    }
    if (confirm("I accept that the details provided are correct.") == false) {
        window.location = './index.html';
    }

    //  add Bank to the network
	
        kycContract.deployed().then(function(kycInstance) {
            return kycInstance.addBank.sendTransaction(bank_name1, pass, reg,{from: web3.eth.accounts[0],gas: 4700000});
        })
        .then(function(result) {
            alert('KYC success!');
			alert(bank_name1 + " has been successfully added to the network!");
    		alert("Login from the \"Login\" Tab on the top-right side of the webpage. \n Thank you for choosing KYC chain!");
        })
        .catch(function(err) {
            alert('KYC error!');
            console.log(err.message);
        });
	

 //   contractInstance.addBank.sendTransaction(bank_name1, pass, reg, {
   //     from: web3.eth.accounts[0],
    //    gas: 4700000
    //});

}

// this function is called on clicking log in button in the pop up that appears while logging in 

function onLogin() {
    var bank_name_l = document.getElementById("username_l").value;
    var pass_l = document.getElementById("password_l").value;

    //  validate input

    if (bank_name_l == "") {
        alert("Enter a valid bank name!");
        return;
    }
    if (pass_l == "") {
        alert("Enter a valid password!");
        return;
    }
	
      kycContract.deployed().then(function(kycInstance) {
            return kycInstance.checkBank.call(bank_name_l, pass_l, {from: web3.eth.accounts[0],gas: 4700000});
        })
        .then(function(result) {
			if (result == "null"){
             alert("Bank not in network. Sign up before proceeding further. Thank You!");
			}
		  else
		  {
			      alert("Welcome " + bank_name_l + " !");
    			  localStorage.bank_eth_account = pass_l;
 				  window.location = './resources/bankHomePage.html';
		  }		  
        })
        .catch(function(err) {
            // enable button again on error
            alert('Login error!');
            console.log(err.message);
        });
	
	


}

