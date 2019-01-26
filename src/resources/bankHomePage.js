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
    $.getJSON('../../build/contracts/kyc.json', function (data) {
        // create contract interface using json data
        kycContract= TruffleContract(data);

        // set contract provider
        kycContract.setProvider(web3Provider);
})
	.then(function(result){
		fillDetails();
	})
}

var currentEth = localStorage.bank_eth_account;

//  function to fill Bank details

function fillDetails() {
	
	
	    alert("Current bank accout: " + currentEth);
	
		kycContract.deployed().then(function(kycInstance) {
            return kycInstance.getBankName.call(currentEth,{from: currentEth,gas: 4700000});
        })
        .then(function(result) {
 			document.getElementById("bank_name").innerHTML = result ;
        })
        .catch(function(err) {
            alert('getBankName error!');
            console.log(err.message);
        });
	
			kycContract.deployed().then(function(kycInstance) {
            return kycInstance.getBankReg.call(currentEth,{from: currentEth,gas: 4700000});
        })
        .then(function(result) {
 			document.getElementById("reg_no").innerHTML = result ;
        })
        .catch(function(err) {
            alert('getBankReg error!');
            console.log(err.message);
        });
	
			kycContract.deployed().then(function(kycInstance) {
            return kycInstance.getBankKYC.call(currentEth,{from: currentEth,gas: 4700000});
        })
        .then(function(result) {
 			document.getElementById("kyc_no").innerHTML = result ;
        })
        .catch(function(err) {
            alert('getBankKYC error!');
            console.log(err.message);
        });
	
			kycContract.deployed().then(function(kycInstance) {
            return kycInstance.getBankRating.call(currentEth,{from: currentEth,gas: 4700000});
        })
        .then(function(result) {
 			//document.getElementById("bank_rating").innerHTML = result ;
        })
        .catch(function(err) {
            alert('getBankRating error!');
            console.log(err.message);
        });

    //  call for getting bank name
   // document.getElementById("bank_name").innerHTML = contractInstance.getBankName.call(currentEth, {
     //   from: currentEth,
        //gas: 4700000
    //});

}

//  function to view a KYC profile

function clickViewKYC() {
	
    var user_name_v = document.getElementById("user_name_v").value;
	
	kycContract.deployed().then(function(kycInstance) {
            return kycInstance.viewCustomer.call(user_name_v);
        })
        .then(function(result) {
		if (result == "Customer not found in database!"){
			 alert("Customer not found in database!");
          return;
	 	}
		
				kycContract.deployed().then(function(kycInstance) {
					return kycInstance.ifAllowed.call(user_name_v,currentEth);
				})
				.then(function(result) {
				if (result == false){
				var l = confirm('Access denied! Take permission from the customer to proceed');
					 if (l == true) {
						 kycContract.deployed().then(function(kycInstance) {
						 return kycInstance.addRequest.sendTransaction(user_name_v, currentEth, { from: currentEth, gas: 4700000 });
						})
						.then(function(result) {		

						})
						.catch(function(err) {
							alert('addRequest error!' + err);
							console.log(err.message);
						});
					}
				  return;
				}
						localStorage.user_name_v = user_name_v;
						window.location = './form/viewForm.html';
				})
				.catch(function(err) {
					alert('ifAllowed error!' + err);
					console.log(err.message);
				});

        })
        .catch(function(err) {
            alert('viewCustomer error!');
            console.log(err.message);
        });
		
}

//  function to modify an existing KYC profile

function clickModifyKYC() {
	
    var user_name_m = document.getElementById("user_name_m").value;
	
	kycContract.deployed().then(function(kycInstance) {
            return kycInstance.viewCustomer.call(user_name_m);
        })
        .then(function(result) {
		if (result == "Customer not found in database!"){
			 alert("Customer not found in database!");
          return;
	 	}
		
				kycContract.deployed().then(function(kycInstance) {
					return kycInstance.ifAllowed.call(user_name_m,currentEth);
				})
				.then(function(result) {
				if (result == false){
				var l = confirm('Access denied! Take permission from the customer to proceed');
					 if (l == true) {
						 kycContract.deployed().then(function(kycInstance) {
						 return kycInstance.addRequest.sendTransaction(user_name_m, currentEth, { from: currentEth, gas: 4700000 });
						})
						.then(function(result) {		

						})
						.catch(function(err) {
							alert('addRequest error!' + err);
							console.log(err.message);
						});
					}
				  return;
				}
						localStorage.user_name_m = user_name_m;
						//redirect to modifyForm.html
						window.location = './form/modifyForm.html';
				})
				.catch(function(err) {
					alert('ifAllowed error!' + err);
					console.log(err.message);
				});

        })
        .catch(function(err) {
            alert('viewCustomer error!');
            console.log(err.message);
        });
		
    //localStorage.user_name_m = user_name_m;
    
    //window.location = './form/modifyForm.html';
}

//  fill the bank details

//fillDetails();

//  function to increase customer rating

function increaseRating() {
    var user_name_mr = document.getElementById("user_name_mr").value;
    if (contractInstance.updateRatingCustomer.call(user_name_mr, true, {
            from: currentEth,
            gas: 4700000
        }) == 1) {
        alert("Customer not in database !");
        return;
    }
    if (confirm("Increase customer rating?") == false) {
        return;
    }
    contractInstance.updateRatingCustomer.sendTransaction(user_name_mr, true, {
        from: currentEth,
        gas: 4700000
    });
}

//  function to decrease customer rating

function decreaseRating() {
    var user_name_mr = document.getElementById("user_name_mr").value;
    if (contractInstance.updateRatingCustomer.call(user_name_mr, false, {
            from: currentEth,
            gas: 4700000
        }) == 1) {
        alert("Customer not in database !");
        return;
    }
    if (confirm("Decrease customer rating?") == false) {
        return;
    }
    contractInstance.updateRatingCustomer.sendTransaction(user_name_mr, false, {
        from: currentEth,
        gas: 4700000
    });
}



function onClickAdd() {

    //  Data = performEncryption(Data);
	
	    alert("Current bank accout: " + currentEth);
	
		kycContract.deployed().then(function(kycInstance) {
            return kycInstance.addCustomer.call("Kartik" ,"Kartik",{from: currentEth.toString(),gas: 4700000});
			// return kycInstance.getBankName.call(currentEth,{from: currentEth,gas: 4700000});
			
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
						return kycInstance.addCustomer.sendTransaction("Kartik" ,"Kartik",{from: currentEth.toString(),gas: 4700000});
					})
					.then(function(result) {
						alert("Customer profile successfully created! Check the customer details from the view form tab. Thank you!");
						window.location = './bankHomePage.html';
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
          //  gas: 4700000
        //});
        //alert("Customer profile successfully created! Check the customer details from the view form tab. Thank you!");
        //window.location = '../bankHomePage.html';
        return true;
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
