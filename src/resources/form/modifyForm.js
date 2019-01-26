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
var user_name = localStorage.user_name_m;

//  function to fill details of the customer in the form

function fillForm() {
	
		kycContract.deployed().then(function(kycInstance) {
          return kycInstance.viewCustomer.call(user_name,{from: current_account,gas: 4700000});
        })
      .then(function(oldData) {	
    	   var toFill = "";
    	   for (var i = 0, j = 0; i < (oldData.length - 2); ++i) {
        		if (oldData[i] == '!' && oldData[i + 1] == '@' && oldData[i + 2] == '#') {
            	if (j == 9) {
                if (toFill = "Male")
                    document.getElementById("gender_m").checked = true;
                else
                    document.getElementById("gender_f").checked = true;
                j += 2;
                i += 2;
                toFill = "";
                continue;
            }
            document.getElementById(allIds[j]).value = toFill;
            toFill = "";
            j++;
            i += 2;
            continue;
        	}
        toFill = toFill + oldData[i];
    	}
	}).catch(function(err) {
         alert('viewCustomer call error!');
         console.log(err.message);
      });
}

//  fill the form

//fillForm();

//  function to modify customer data based on changes made in the form

function onClickModify() {
    var Data = getInfo();
    if (Data == undefined) {
        alert("Valid details required!");
        window.location = '../bankHomePage.html';
        return false;
    }
    var check = contractInstance.modifyCustomer.call(user_name, Data, {
        from: current_account,
        gas: 4700000
    });
    if (check == 7) {
        alert("Access denied!");
        window.location = '../bankHomePage.html';
        return false;
    } else if (check == 1) {
        alert("Username not found!");
        window.location = '../bankHomePage.html';
        return false;
    } else {
        contractInstance.modifyCustomer.sendTransaction(user_name, Data, {
            from: current_account,
            gas: 4700000
        });
        alert("Customer profile successfully modified! Check the customer details from the view form tab. Thank you!");
        window.location = '../bankHomePage.html';
        return false;
    }
}

//  function to extract data from the filled form


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

//  function to delete the KYC profile

function onClickDelete() {
	
    if (window.confirm("Are you sure you want to delete the KYC profile " + user_name + " ?") == false) {
        window.location = '../bankHomePage.html';
        return false;
    }
	
		kycContract.deployed().then(function(kycInstance) {
          return kycInstance.removeCustomer.call(user_name,{from: current_account,gas: 4700000});
        })
      .then(function(result) {	
			if(result ==1) { 
				   alert("Customer not found!");
        		   window.location = '../bankHomePage.html';
        		  return false;				
					}			
					kycContract.deployed().then(function(kycInstance) {
          			return kycInstance.removeCustomer.sendTransaction(user_name,{from: current_account,gas: 4700000});
       				 }).then(function(result) {	
	 				 alert("Customer successfully removed!");
    				 window.location = '../bankHomePage.html';
    				 return false;
    				}).catch(function(err) {
     			    alert('removeCustomer sendTransaction error!');
    			     console.log(err.message);
    				 });
    
    	}).catch(function(err) {
         alert('removeCustomer call error!');
         console.log(err.message);
      });
	
    //if (contractInstance.removeCustomer.call(user_name, {
            //from: current_account,
          //  gas: 4700000
        //}) == 1) {
        //alert("Customer not found!");
        //window.location = '../bankHomePage.html';
      //  return false;
    //}
    //contractInstance.removeCustomer.sendTransaction(user_name, {
        //from: current_account,
      //  gas: 4700000
    //});
    //alert("Customer successfully removed!");
    //window.location = '../bankHomePage.html';
    //return false;
}