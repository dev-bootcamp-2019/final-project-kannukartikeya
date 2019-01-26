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
		//fillDetails();
	})
}

function onClickLogin() {
    var username_c = document.getElementById("username").value;
    var password_c = document.getElementById("password").value;
	
	   kycContract.deployed().then(function(kycInstance) {
        return kycInstance.checkCustomer.call(username_c, password_c);
        })
        .then(function(result) {
		   if(result == false) {
            alert("Sorry! Invalid username or password. Sign up first if you haven't!");
			return false;
		   }
		       //  alert("Welcome "+username_c+" !");
    		localStorage.username_c = username_c;
    		localStorage.password_c = password_c;
    		alert("Welcome " + localStorage.username_c + " !");
    		window.location = './customerHomePage.html';
    		return false;
        })
        .catch(function(err) {
            alert('checkCustomer error!');
            console.log(err.message + err);
        });
	
	
    //if (kycContract.checkCustomer.call(username_c, password_c) == false) {
      //  alert("Sorry! Invalid username or password. Sign up first if you haven't!");
        //return false;
    //}

}

function onClickSignUp() {
    var username_c = document.getElementById("usernamesignup").value;
    var password_c = document.getElementById("passwordsignup").value;
    var c_password_c = document.getElementById("passwordsignup_confirm").value;
    if (password_c != c_password_c) {
        alert("Confirm your password correctly!");
        return false;
    }
	kycContract.deployed().then(function(kycInstance) {
        return kycInstance.setPassword.call(username_c, password_c);
        })
        .then(function(result) {
		 if(result == false) {
         		alert("Account already in use or You have to undergo a KYC check at least once!");
				return false;
		   	}
 		 alert("hi");
		 	   kycContract.deployed().then(function(kycInstance) {
        	    return kycInstance.setPassword.sendTransaction(username_c, password_c, { from: web3.eth.accounts[0], gas: 4700000 });
       		 	})
        		.then(function(result) {
        	  		alert("Successfully registered account! Go to the login area to proceed!");
      		  	})
       			.catch(function(err) {
        	 		alert('setPassword sendTransaction error!');
        	 	    console.log(err.message);
       		 	});
				
    	 return false;
        })
        .catch(function(err) {
            alert('setPassword call error!');
            console.log(err.message + err);
        });
	
    //if (contractInstance.setPassword.call(username_c, password_c) == false) {
      //  alert("Account already in use or You have to undergo a KYC check at least once!");
        //return false;
    //}
    //alert("hi");
    //contractInstance.setPassword.sendTransaction(username_c, password_c, { from: web3.eth.accounts[0], gas: 4700000 });
    //alert("Successfully registered account! Go to the login area to proceed!");
    //return false;
}