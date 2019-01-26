/*

This test file has been updated for Truffle version 5.0. If your tests are failing, make sure that you are
using Truffle version 5.0. You can check this by running "trufffle version"  in the terminal. If version 5 is not
installed, you can uninstall the existing version with `npm uninstall -g truffle` and install the latest version (5.0)
with `npm install -g truffle`.

*/

var kyc = artifacts.require('kyc')

contract('kyc', function(accounts) {

    const bank = accounts[0]
    const bank2 = accounts[1]
    const bank3 = accounts[2]
    const bank4 = accounts[3]
    const bank5 = accounts[4]
    var uname
    const regNum = "1000"

    it("should add a bank with provided name & password and later check login credentials for the bank", async() => {
        const kycinstance = await kyc.deployed()

        var eventEmitted = false
        const name = "bank1"
	
	const tx = await kycinstance.addBank(name, bank,regNum)
	
	if (tx.logs[0].event) {
		uname = tx.logs[0].args.uname
		eventEmitted = true
	}
        
        const result = await kycinstance.checkBank(name,bank)
console.log(result);
	const returnVal = "0"

        assert.equal(result, returnVal, 'the return of checkbank matches expected values')
        assert.equal(eventEmitted, true, 'adding a bank should emit a For addBank event')
    })

    it("should add bank2 with the provided name,password,registration number and check it is part of consotium of banks", async() => {
        const kycinstance = await kyc.deployed()

        var eventEmitted = false
        const name = "bank2"
	
	const tx = await kycinstance.addBank(name, bank2,regNum)
	
	if (tx.logs[0].event) {
		uname = tx.logs[0].args.uname
		eventEmitted = true
	}
        
        const result = await kycinstance.isPartOfOrg({from: bank2})
	const returnVal = true;

        assert.equal(result, returnVal, 'the return of isPartOfOrg matches expected values')
        assert.equal(eventEmitted, true, 'adding a bank should emit a addBank event')
    })

    it("should add bank3 with provided name,password,registration number,check if it is already part of consotium & then remove it", async() => {
        const kycinstance = await kyc.deployed()

        var eventEmitted = false
        const name = "bank3"
	
	const tx = await kycinstance.addBank(name, bank3,regNum)
	
	if (tx.logs[0].event) {
		uname = tx.logs[0].args.uname
		eventEmitted = true
	}
        
        const removeResult = await kycinstance.removeBank(bank3)

        const result = await kycinstance.isPartOfOrg({from: bank3})
	const returnVal = false;

        assert.equal(result, returnVal, 'the return of isPartOfOrg matches expected values')
        assert.equal(eventEmitted, true, 'adding a bank should emit addBank event')
    })
    it("should add bank4 with provided name,password,registration number,add a kyc of a new customer", async() => {
        const kycinstance = await kyc.deployed()

        var eventEmitted = false
        const name = "bank4"
        const custname = "customer1"

        const datahash = "custid1 address1 pincode1 state1 country1"
	
	const tx = await kycinstance.addBank(name, bank4,regNum)
	
	if (tx.logs[0].event) {
		uname = tx.logs[0].args.uname
		eventEmitted = true
	}
        
        const addResult = await kycinstance.addCustomer(custname,datahash)

        const result = await kycinstance.checkCustomer(custname,"null")

	const returnVal = true;

        assert.equal(result, returnVal, 'addCustomer return true')
        assert.equal(eventEmitted, true, 'adding a bank should emit addBank event')
    })
    it("bank5 should add a kyc of a new customer and then remove it due to fraudlent transactions", async() => {
        const kycinstance = await kyc.deployed()

        var eventEmitted = false
        const name = "bank5"
        const custname = "customer2"

        const datahash = "custid2 address2 pincode2 state2 country2"
	
	const tx = await kycinstance.addBank(name, bank5,regNum)
	
	if (tx.logs[0].event) {
		uname = tx.logs[0].args.uname
		eventEmitted = true
	}
        
        const addResult = await kycinstance.addCustomer(custname,datahash)

        const removeResult = await kycinstance.removeCustomer(custname)

        const result = await kycinstance.checkCustomer(custname,"null")

	const returnVal = false;

        assert.equal(result, returnVal, 'able to successfuly do kyc of customer2 and later remove it due to fraudelent behavior')
        assert.equal(eventEmitted, true, 'adding a bank should emit addBank event')
    })
});
