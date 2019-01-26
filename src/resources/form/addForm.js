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
//  account to make all transactions

var current_account = localStorage.bank_eth_account.toString();

//  function to create a new KYC profile

function onClickAdd() {
    var Data = getInfo();
    var usnm = document.getElementById("legal_name").value;
    if (Data == undefined || usnm == "") {
        alert("Valid details required!");
        window.location = '../bankHomePage.html';
        return;
    }
    //  Data = performEncryption(Data);
	
	    alert("Current bank accout: " + current_account);
	
		kycContract.deployed().then(function(kycInstance) {
            return kycInstance.addCustomer.call(usnm.toString(), Data.toString(),{from: current_account.toString(),gas: 4700000});
        })
        .then(function(check) {
				if (check == 7) {
				alert("Access denied!");
				window.location = '../bankHomePage.html';
				return false;

			} else if (check == 1) {
				alert("Service limit reached! Try after some time...");
				window.location = '../bankHomePage.html';
				return false;
			} else if (check == 2) {
				alert("Customer already in database! Go to the modify form if you wish to change customer details. Thank you!");
				window.location = '../bankHomePage.html';
				return false;
			}
			else {

					kycContract.deployed().then(function(kycInstance) {
						return kycInstance.addCustomer.sendTransaction(usnm, Data,{from: current_account.toString(),gas: 4700000});
					})
					.then(function(result) {
						alert("Customer profile successfully created! Check the customer details from the view form tab. Thank you!");
						window.location = '../bankHomePage.html';
						return false;
					})
					.catch(function(err) {
						alert('addCustomer transaction error!');
						console.log(err.message);
					});

					//contractInstance.addCustomer.sendTransaction(usnm, Data, {
					//	from: current_account.toString(),
					//gas: 4700000
					//});
					//alert("Customer profile successfully created! Check the customer details from the view form tab. Thank you!");
					//window.location = '../bankHomePage.html';
					//return false;

   		 	}
        })
        .catch(function(err) {
            alert('addCustomer call error!');
            console.log(err.message);
        });
	
	
  //  alert("Current bank accout: " + current_account);
    //var check = contractInstance.addCustomer.call(usnm.toString(), Data.toString(), {
      //  from: current_account.toString(),
        //gas: 4700000
    //});
    //if (check == 7) {
      //  alert("Access denied!");
        //window.location = '../bankHomePage.html';
        //return false;

    //} else if (check == 1) {
      //  alert("Service limit reached! Try after some time...");
        //window.location = '../bankHomePage.html';
        //return false;
    //} else if (check == 2) {
      //  alert("Customer already in database! Go to the modify form if you wish to change customer details. Thank you!");
        //window.location = '../bankHomePage.html';
        //return false;
    //} else {
      //  contractInstance.addCustomer.sendTransaction(usnm, Data, {
        //    from: current_account.toString(),
        //    gas: 4700000
        //});
        //alert("Customer profile successfully created! Check the customer details from the view form tab. Thank you!");
        //window.location = '../bankHomePage.html';
        //return false;
}
//  function to extract data from the form

function getInfo() {
    var data = document.getElementById("legal_name").value + "!@#" + document.getElementById("tax_id").value + "!@#" + document.getElementById("bus_desc").value + "!@#" + document.getElementById("bus_type").value + "!@#" +
		document.getElementById("fir_sign").value + "!@#" +
	    document.getElementById("sec_sign").value + "!@#" + 
		document.getElementById("thi_sign").value + "!@#" + document.getElementById("tot_annu_rev").value + "!@#" + document.getElementById("as_of_dat").value + "!@#";
    if (document.getElementById("gender_m").checked)
        data = data + "Public";
    else
        data = data + "Private";
    data = data + "!@#" + document.getElementById("address").value + "!@#" + document.getElementById("phone_1").value + "!@#" + document.getElementById("phone_2").value + "!@#" + document.getElementById("email").value + "!@#" + document.getElementById("country_res").value + "!@#";

    return data;
}