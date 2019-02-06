pragma solidity ^0.4.4;

/** @title Customer Due Deligence - chain
  * @author Kartikeya Gupta
*/

import "./SafeMath.sol";



contract owned {
	function owned() { owner = msg.sender ;}  
	address owner;
}

/** @title kyc onboarding contract */
contract kyc is owned {

    //  Struct customer
    //  uname - username of the customer
    //  dataHash - customer data
    //  rating - rating given to customer given based on regularity
    //  upvotes - number of upvotes recieved from banks
    //  bank - address of bank that validated the customer account

    struct Customer {
        string uname;
        string dataHash;
        uint rating;
        uint upvotes;
        address bank;
        string password;
    }

    //  Struct Organisation
    //  name - name of the bank/organisation
    //  ethAddress - ethereum address of the bank/organisation
    //  rating - rating based on number of valid/invalid verified accounts
    //  KYC_count - number of KYCs verified by the bank/organisation

    struct Organisation {
        string name;
        address ethAddress;
        uint rating;
        uint KYC_count;
        string regNumber;
    }

    struct Request {
        string uname;
        address bankAddress;
        bool isAllowed;
    }

    //  list of all customers

    Customer[] allCustomers;

    //  list of all Banks/Organisations

    Organisation[] allOrgs;


    Request[] allRequests;

    event addBankEvent ( string uname);
    

    /** @dev check if financial institution/bank is authorised by client to view kyc details.
      * @param Uname Name of the customer.
      * @param bankAddress Ethereum account for the bank.
      * @return bool True if allowed and false if not allowed
      */
    function ifAllowed(string Uname, address bankAddress) public payable returns(bool) {
        for(uint i = 0; i < allRequests.length; ++i) {
            if(stringsEqual(allRequests[i].uname, Uname) && allRequests[i].bankAddress == bankAddress && allRequests[i].isAllowed) {
                return true;
            }
        }
        return false;
    }


    /** @dev Get list of all access requests from financial institution/banks interested in KYC details of the customer.
      * @param Uname Name of the customer.
      * @param ind iterator sent from ui.
      * @return address Ethereum account of financial institution/bank for approval/rejection and 0x14e041521a40e32ed88b22c0f32469f5406d757a if not requests are pending.
      */
  function getBankRequests1(string Uname, uint ind) public payable returns(address) {
        uint j = 0;
        for(uint i=0;i<allRequests.length;++i) {
            if(stringsEqual(allRequests[i].uname, Uname) && j == ind && allRequests[i].isAllowed == false) {
                return allRequests[i].bankAddress;
            }
            j ++;
        }
        return 0x14e041521a40e32ed88b22c0f32469f5406d757a;
    }

    /** @dev Not used however kept for reference **/ 
    function getBankRequests(string Uname, uint ind) public payable returns(address) {
        uint j = 0;
        for(uint i=0;i<allRequests.length;++i) {
            if(stringsEqual(allRequests[i].uname, Uname) && j == ind ) { 
				if(allRequests[i].isAllowed == false) {
                		return allRequests[i].bankAddress;
					}
					else {
						return 0x14e041521a40e32ed88b22c0f32469f5406d757b;
					}
            	}
            j ++;
        }
        return 0x14e041521a40e32ed88b22c0f32469f5406d757a;
    }

    /** @dev Not used however kept for reference **/ 
    function getBankRequestsDetails(string Uname, uint ind) public payable returns(address,bool) {
        uint j = 0;
        for(uint i=0;i<allRequests.length;++i) {
            if(stringsEqual(allRequests[i].uname, Uname) && j == ind) {
                return (allRequests[i].bankAddress,allRequests[i].isAllowed);
            }
            j ++;
        }
        return (0x14e041521a40e32ed88b22c0f32469f5406d757a,true);
    }


    /** @dev Get the count of KYC access request to be approved by the customer.
      * @param Uname Name of the customer.
      * @param ind Currently not used.
      * @return uint Count of access request pending approval/rejection from client.
      */
    function getBankRequestsCount(string Uname, uint ind) public payable returns(uint) {
        return allRequests.length;
    }


    /** @dev Add access request from financial institution/banks interested in KYC details of the customer.
      * @param Uname Name of the customer.
      * @param bankAddress Ethereum account of financial institution/bank which has tried to access KYC details of customer.
      * @return bool True is request is added successfully & false if request already exists.
      */
    function addRequest(string Uname, address bankAddress) public payable returns(bool){
        for(uint i = 0; i < allRequests.length; ++ i) {
            if(stringsEqual(allRequests[i].uname, Uname) && allRequests[i].bankAddress == bankAddress) {
                return false;
            }
        }
        allRequests.length ++;
        allRequests[allRequests.length - 1] = Request(Uname, bankAddress, false);
	return true;
    }

    /** @dev Approve/Reject KYC access request for financial institution/bank by customer
      * @param Uname Name of the customer.
      * @param bankAddress Ethereum account of financial institution/bank which has tried to access KYC details of customer.
      * @param bankAddress True if customer approves kyc acess request & false otherwise.
      */
    function allowBank(string Uname, address bankAddress, bool ifallowed) public payable {
        for(uint i = 0; i < allRequests.length; ++ i) {
            if(stringsEqual(allRequests[i].uname, Uname) && allRequests[i].bankAddress == bankAddress) {
                if(ifallowed) {
                    allRequests[i].isAllowed = true;
                } else {
                    for(uint j=i;j<allRequests.length-1; j++) {
                        allRequests[j] = allRequests[j+1];
                    }
                    allRequests.length --;
                }
                return;
            }
        }
    }

    //   internal function to compare strings
    function stringsEqual(string storage _a, string memory _b) internal returns (bool) {
		bytes storage a = bytes(_a);
		bytes memory b = bytes(_b);
		if (a.length != b.length)
			return false;
		// @todo unroll this loop
		for (uint i = 0; i < a.length; i ++)
        {
			if (a[i] != b[i])
				return false;
        }
		return true;
	}


    /** @dev function to check access rights of transaction request sender
      * @return true  if successfull, false otherwise 
	*/
    function isPartOfOrg() public view returns(bool) {
        for(uint i = 0; i < allOrgs.length; ++ i) {
            if(allOrgs[i].ethAddress == msg.sender)
                return true;
        }
        return false;
    }

    /** @dev function that adds an organisation to the network.no check on access rights if network strength in zero
      * @param uname Name of the customer
      * @param eth Ethereum account of financial institution/bank as password
      * @param regNum Registration authority/number
      * @return uint 0 if successfull,if no access rights to transaction request sender
      */
    function addBank(string uname, address eth, string regNum) public payable returns(uint) {
	emit addBankEvent ( uname);
        if(allOrgs.length == 0 || isPartOfOrg()) {
	    allOrgs.length = SafeMath.add(allOrgs.length,1);
            //allOrgs.length ++;
            allOrgs[allOrgs.length - 1] = Organisation(uname, eth, 200, 0, regNum);
            return 0;
        }

        return 7;
    }

    /** @dev function that removes an organisation from the network
      * @param eth Ethereum account of financial institution/bank
      * @return uint 0 if successfull,7 if no access rights to transaction request sender,1 if organisation to be removed not part of network
      */
    function removeBank(address eth) public payable returns(uint) {
        if(!isPartOfOrg())
            return 7;
        for(uint i = 0; i < allOrgs.length; ++ i) {
            if(allOrgs[i].ethAddress == eth) {
                for(uint j = i+1;j < allOrgs.length; ++ j) {
                    allOrgs[i-1] = allOrgs[i];
                }
		allOrgs.length = SafeMath.sub(allOrgs.length,1);
                //allOrgs.length --;
                return 0;
            }
        }
        return 1;
    }

    /** @dev function that adds a customer profile to network
      * @param Uname Name of the customer
      * @param DataHash KYC details of cutomer is form of demiliter based string
      * @return uint 0 if successfull, 7 if no access rights to transaction request sender,1 if size limit of the database is reached,2 if customer already in network
      */

    function addCustomer(string Uname, string DataHash) public payable returns(uint) {
        if(!isPartOfOrg())
            return 7;
        //  throw error if username already in use
        for(uint i = 0;i < allCustomers.length; ++ i) {
            if(stringsEqual(allCustomers[i].uname, Uname))
                return 2;
        }
        allCustomers.length ++;
        //  throw error if there is overflow in uint
        if(allCustomers.length < 1)
            return 1;
        allCustomers[allCustomers.length-1] = Customer(Uname, DataHash, 100, 0, msg.sender, "null");
        updateRating(msg.sender,true);
        return 0;
    }

    /** @dev function to remove fraudulent customer profile from the database
      * @param Uname Name of the customer
      * @return uint 0 if successfull, 7 if no access rights to transaction request sender,1 if size limit of the database is reached,1 if customer profile not in database
      */

    function removeCustomer(string Uname) public payable returns(uint) {
        if(!isPartOfOrg())
            return 7;
        for(uint i = 0; i < allCustomers.length; ++ i) {
            if(stringsEqual(allCustomers[i].uname, Uname)) {
                address a = allCustomers[i].bank;
                for(uint j = i+1;j < allCustomers.length; ++ j) {
                    allCustomers[i-1] = allCustomers[i];
                }
                allCustomers.length --;
                updateRating(a,false);
                //  updateRating(msg.sender, true);
                return 0;
            }
        }
        //  throw error if uname not found
        return 1;
    }

    /** @dev function to function to modify a customer profile in database
      * @param Uname Name of the customer
      * @param DataHash modified KYC details of cutomer is form of demiliter based string
      * @return uint 0 if successfull, 7 if no access rights to transaction request sender,1 if size limit of the database is reached,1 if customer profile not in database
      */

    function modifyCustomer(string Uname,string DataHash) public payable returns(uint) {
        if(!isPartOfOrg())
            return 7;
        for(uint i = 0; i < allCustomers.length; ++ i) {
            if(stringsEqual(allCustomers[i].uname, Uname)) {
                allCustomers[i].dataHash = DataHash;
                allCustomers[i].bank = msg.sender;
                return 0;
            }
        }
        //  throw error if uname not found
        return 1;
    }

    /** @dev function to return customer profile data
      * @param Uname Name of the customer
      * @return string delimited KYC details of customer if successfull, Access Denied - if no access rights to transaction request sender, customer profile not in database
      */

    function viewCustomer(string Uname) public payable returns(string) {
        if(!isPartOfOrg())
            return "Access denied!";
        for(uint i = 0; i < allCustomers.length; ++ i) {
            if(stringsEqual(allCustomers[i].uname, Uname)) {
                return allCustomers[i].dataHash;
            }
        }
        return "Customer not found in database!";
    }

    /** @dev function to modify customer rating
      * @param Uname Name of the customer
      * @param ifIncrease true if rating needs to be increased or decrease otherwise 
      * @return 0 if successful ,  1 if bank is not found
      */
    function updateRatingCustomer(string Uname, bool ifIncrease) public payable returns(uint) {
        for(uint i = 0; i < allCustomers.length; ++ i) {
            if(stringsEqual(allCustomers[i].uname, Uname)) {
                //update rating
                if(ifIncrease) {
                    allCustomers[i].upvotes ++;
                    allCustomers[i].rating += 100/(allCustomers[i].upvotes);
                    if(allCustomers[i].rating > 500) {
                        allCustomers[i].rating = 500;
                    }
                }
                else {
                    allCustomers[i].upvotes --;
                    allCustomers[i].rating -= 100/(allCustomers[i].upvotes + 1);
                    if(allCustomers[i].rating < 0) {
                        allCustomers[i].rating = 0;
                    }
                }
                return 0;
            }
        }
        //  throw error if bank not found
        return 1;
    }

    /** @dev function to update organisation rating
      * @param bankAddress Ethereum account of financial institution/bank
      * @param ifAdded true  indicates a succesfull addition of KYC profile
      * @return 0 if successful ,  1 if bank is not found
      */

    function updateRating(address bankAddress,bool ifAdded) public payable returns(uint) {
        for(uint i = 0; i < allOrgs.length; ++ i) {
            if(allOrgs[i].ethAddress == bankAddress) {
                //update rating
                if(ifAdded) {
                    allOrgs[i].KYC_count ++;
                    allOrgs[i].rating += 100/(allOrgs[i].KYC_count);
                    if(allOrgs[i].rating > 500) {
                        allOrgs[i].rating = 500;
                    }
                }
                else {
                    //  allOrgs[i].KYC_count --;
                    allOrgs[i].rating -= 100/(allOrgs[i].KYC_count + 1);
                    if(allOrgs[i].rating < 0) {
                        allOrgs[i].rating = 0;
                    }
                }
                return 0;
            }
        }
        //  throw error if bank not found
        return 1;
    }

    /** @dev function to to validate bank log in
      * @param Uname Name of the Bank
      * @param password Ethereum account of financial institution/bank
      * @return string "0" if successful ,  null if fails
      */
    function checkBank(string Uname, address password) public view returns(string) {
        for(uint i = 0; i < allOrgs.length; ++ i) {
            if(allOrgs[i].ethAddress == password && stringsEqual(allOrgs[i].name, Uname)) {
                return "0";
            }
        }
        return "null";
    }

    /** @dev function to validate customer log in
      * @param Uname Name of the Customer
      * @param password Password for the customer
      * @return book true if successful ,  false if fails
      */
    function checkCustomer(string Uname, string password) public view  returns(bool) {
        for(uint i = 0; i < allCustomers.length; ++ i) {
            if(stringsEqual(allCustomers[i].uname, Uname) && stringsEqual(allCustomers[i].password, password)) {
                return true;
            }
            if(stringsEqual(allCustomers[i].uname, Uname)) {
                return false;
            }
        }
        return false;
    }

    /** @dev function to set password for the customer
      * @param Uname Name of the Customer
      * @param password Password for the customer
      * @return book true if successful ,  false if fails
      */
    function setPassword(string Uname, string password) public payable returns(bool) {
        for(uint i=0;i < allCustomers.length; ++ i) {
            if(stringsEqual(allCustomers[i].uname, Uname) && stringsEqual(allCustomers[i].password, "null")) {
                allCustomers[i].password = password;
                return true;
            }
        }
        return false;
    }

    /** @dev function to get bank name
      * @param ethAcc Ethereum account for the bank
      * @return string name if successful ,  null if fails
      */

    function getBankName(address ethAcc) public payable returns(string) {
        for(uint i = 0; i < allOrgs.length; ++ i) {
            if(allOrgs[i].ethAddress == ethAcc) {
                return allOrgs[i].name;
            }
        }
        return "null";
    }

    /** @dev function to get bank account
      * @param uname Name of the bank
      * @return address account if successful ,  0x14e041521a40e32ed88b22c0f32469f5406d757a if fails
      */
    function getBankEth(string uname) public payable returns(address) {
        for(uint i = 0; i < allOrgs.length; ++ i) {
            if(stringsEqual(allOrgs[i].name, uname)) {
                return allOrgs[i].ethAddress;
            }
        }
        return 0x14e041521a40e32ed88b22c0f32469f5406d757a;
    }

    /** @dev function to get bank name of customer 
      * @param Uname Name of the customer
      * @return string name if successful
      */
    function getCustomerBankName(string Uname) public payable returns(string) {
        for(uint i = 0;i < allCustomers.length; ++ i) {
            if(stringsEqual(allCustomers[i].uname, Uname)) {
                return getBankName(allCustomers[i].bank);
            }
        }
    }

    /** @dev function to get bank reg number of bank 
      * @param ethAcc Ethereum account of the bank 
      * @return string regNumber if successful, null if fails
      */
    function getBankReg(address ethAcc) public payable returns(string) {
        for(uint i = 0; i < allOrgs.length; ++ i) {
            if(allOrgs[i].ethAddress == ethAcc) {
                return allOrgs[i].regNumber;
            }
        }
        return "null";
    }

    /** @dev function to get bank KYC count 
      * @param ethAcc Ethereum account of the bank 
      * @return uint count of KYC if successful, 0 otherwise
      */
    function getBankKYC(address ethAcc) public payable returns(uint) {
        for(uint i = 0; i < allOrgs.length; ++ i) {
            if(allOrgs[i].ethAddress == ethAcc) {
                return allOrgs[i].KYC_count;
            }
        }
        return 0;
    }

    /** @dev function to get bank rating
      * @param ethAcc Ethereum account of the bank 
      * @return uint rating of bank 
      */
    function getBankRating(address ethAcc) public payable returns(uint) {
        for(uint i = 0; i < allOrgs.length; ++ i) {
            if(allOrgs[i].ethAddress == ethAcc) {
                //return allOrgs[i].rating;
                return allOrgs[i].KYC_count;
            }
        }
        return 0;
    }

    /** @dev function to get bank rating
      * @param Uname Name of the customer 
      * @return uint rating of bank 
      */
    function getCustomerBankRating(string Uname) public payable returns(uint) {
        for(uint i = 0;i < allCustomers.length; ++ i) {
            if(stringsEqual(allCustomers[i].uname, Uname)) {
                return getBankRating(allCustomers[i].bank);
            }
        }
    }

    /** @dev function to get customer rating
      * @param Uname Name of the customer 
      * @return uint rating of customer,0 otherwise 
      */
    function getCustomerRating(string Uname) public payable returns(uint) {
        for(uint i = 0; i < allCustomers.length; ++ i) {
            if(stringsEqual(allCustomers[i].uname, Uname)) {
                return allCustomers[i].rating;
            }
        }
        return 0;
    }

    /** @dev function to kill contract
      */
	function kill(){
	if(msg.sender ==owner)  selfdestruct(owner);
	}
}
