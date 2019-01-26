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
		alert ('Requests');
		what();
	})
}


//  account to make all transactions

var current_account = web3.eth.accounts[0];
var user_name = localStorage.username_c;

//  function to fill customer data in form

function fillForm() {
	
       alert(user_name);
	
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
	
	
	
   // document.getElementById("bank_rating").innerHTML = (contractInstance.getCustomerBankRating.call(user_name, {
     //   from: current_account,
       // gas: 4700000
    //})) / 100;
}

//  fill the KYC form


var arr = [];

function what() {
	//init();
	var req = -1;
	var cnt = 0;
    var add = "not";
	
	    kycContract.deployed().then(function(kycInstance) {
            return kycInstance.getBankRequestsCount.call(user_name, 1);
        })
        .then(function(count) {
			alert(count);
			for(i=0;i<count;i++){
			 kycContract.deployed().then(function(kycInstance) {
			 var instancee = kycInstance;
				 req++;
			 return instancee.getBankRequests1.call(user_name, req);
				 //cnt++;
			 }).then(function(add){
				  		alert (add);
				 if (add != "0x14e041521a40e32ed88b22c0f32469f5406d757b" && add != "0x14e041521a40e32ed88b22c0f32469f5406d757a") {
					  kycContract.deployed().then(function(kycInstance) {

           				 return kycInstance.getBankName.call(add);
       				 }).then(function(name){
					 document.write("<div class=\"form-group\"><label class=\"col-md-4 control-label\" id = \"bank_name_l\">" + name + "</label><div class=\"col-md-4 inputGroupContainer\"><div class=\"input-group\"><button type=\"submit\" class=\"btn btn-success\" id = \"addKYCSend\" onclick = \"return allow(" + cnt.toString() + ")\">Allow </button>                                          <button type=\"submit\" class=\"btn btn-danger\" id = \"addKYCSend1\" onclick = \"return deny(" + cnt + ")\">Deny </button>                         </div></div></div><br>");
					 arr.push(add);
						  cnt++;
					  })
				 }
				 
				  
			 })
			}
			  
			}).catch(function(err) {
            alert('getBankRequestsCount error!');
            console.log(err.message);
			})
       	
	//var count = contractInstance.getBankRequestsCount.call(user_name, 1);
	
	
    //for (var i = 0; i< count; ++i) {
	//var details = contractInstance.getBankRequestsDetails.call(user_name, i);
      //  add = contractInstance.getBankRequests.call(user_name, i);
        //if (add != "0x14e041521a40e32ed88b22c0f32469f5406d757b" && add != "0x14e041521a40e32ed88b22c0f32469f5406d757a") {
            //break;
        //document.write("<div class=\"form-group\"><label class=\"col-md-4 control-label\" id = \"bank_name_l\">" + contractInstance.getBankName.call(add) + "</label><div class=\"col-md-4 inputGroupContainer\"><div class=\"input-group\"><button type=\"submit\" class=\"btn btn-success\" id = \"addKYCSend\" onclick = \"return allow(" + cnt.toString() + ")\">Allow </button>                                          <button type=\"submit\" class=\"btn btn-danger\" id = \"addKYCSend1\" onclick = \"return deny(" + cnt + ")\">Deny </button>                         </div></div></div><br>");
        //arr.push(add);
        //cnt++;
		//}
    //}
    //alert(arr[0]);
}

function allow(num) {
    //alert(num);
		alert("Allow " + arr[num] + " ?");
	    kycContract.deployed().then(function(kycInstance) {
            return kycInstance.allowBank.sendTransaction(user_name, arr[num], true, { from: web3.eth.accounts[0], gas: 4700000 });
        })
        .then(function(result) {
			return false;
        })
        .catch(function(err) {
            alert('allowBank error!');
            console.log(err.message);
        });
   // alert("Allow " + arr[num] + " ?");
    //contractInstance.allowBank.sendTransaction(user_name, arr[num], true, { from: web3.eth.accounts[0], gas: 4700000 });
    
}

function deny(num) {
	    alert("Deny " + arr[num] + " ?");
	    kycContract.deployed().then(function(kycInstance) {
            return kycInstance.allowBank.sendTransaction(user_name, arr[num], false, { from: web3.eth.accounts[0], gas: 4700000 });
        })
        .then(function(result) {
			return false;
        })
        .catch(function(err) {
            alert('allowBank error!');
            console.log(err.message);
        });
	
    
    //contractInstance.allowBank.sendTransaction(user_name, arr[num], false, { from: web3.eth.accounts[0], gas: 4700000 });
    //return false;
}