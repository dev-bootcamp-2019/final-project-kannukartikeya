#Customer Due Deligence - chain
--------------------------------
Customer Due Deligence /Enhance Due Deligence checks are currently manual, repetitive and costly to all financial companies.

## Current State : 

![KYC Flow](src/img/extension/KYC_Current.png?raw=true)

To prevent Anti-Money laundering and other financial crimes, regulators are also getting more and more stingent on Know Your Customer checks for Due Deligence.
Further Customer also needs to submit similar identify and financial documents related to specific financial products everytime with each of the financial institutions and 
sometime even in multiple departments within same financial institutions which creates frustrating and negative experience to customer.
Additionally these deligence checks needs to be done not at the time of onboarding of customer but also on year on year basis to comply with AML regulations.
Currently there is no singe golden source of KYC data for the customers available to banks and reason why each financial institution has to perform due deligence saperately 
resulting huge cost to the institution. Also any fraudlent activity perfomed by a customer with one institution is very lately noticed by other financial institutions due to 
which these institutions runs in the risk of penalise heavily by regulation.

## Proposed State : 

Blockchain based due deligence address above mentioned challenges while keeping self-sovereignty of the customer data in the control of the customer itself. 

![KYC Flow](src/img/extension/KYC_Future.png?raw=true)

## User Stories
1. As a Financial institutions/Bank, system should allow to onboard on blockchain consotium network.
2. As a customer of financial institution/Bank, system should allow to onboard on blockchain consotium network of financial institutions/banks.
3. As a financial institution/Bank , system should allow to create/view and modify due-deligence of onboarded customer. 
4. As a customer of financial institution/bank , system should allow customer to approve/reject due-deligence request.
5. As a financial institution/Bank , system should allow access of due-deligence customer data performed by other financial institution/Bank.
6. As a customer of financial institution/bank , system should allow customer to approve/reject due-deligence access request of other financial institution/Bank.
7. As a financial institution/Bank , system should allow sharing of fraudlent behavior of customer with other financial institions.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

npm version is >= 5.6.0

Truffle v5.0.1 (core: 5.0.1)

Solidity 0.4.25 

Ganache CLI v6.1.0 (ganache-core: 2.1.0)

Node v9.11.1

Chrome Web server ( add ons)

### Installing

Start Ganache cli or use Ganche UI at https://truffleframework.com/ganache ( ppt for UI flow below uses UI version)

```
ganache-cli 

```

Move to the project root and run truffle compile/migrate:

```
truffle compile
truffle migrate
```

## Running the tests

Move to the project root and run "truffle test" command:

```
truffle test

Using network 'development'.

  Contract: kyc

    ✓ should add a bank with provided name & password and later check login credentials for the bank (225ms)
    ✓ should add bank2 with the provided name,password,registration number and check it is part of consotium of banks (103ms)
    ✓ should add bank3 with provided name,password,registration number,check if it is already part of consotium & then remove it (153ms)
    ✓ should add bank4 with provided name,password,registration number,add a kyc of a new customer (181ms)
    ✓ bank5 should add a kyc of a new customer and then remove it due to fraudlent transactions (236ms)

  5 passing (934ms)

```

## Extending contract

``` 
kyc contract extends onwer contract and allow only the owner of the contract to destroy it

```

## Deployment to Development and Rinkeby env

For Truffle to derive the Ethereum address from your mnemonic, Truffle HD wallet provider needs to be installed. Run the below mentioned commands

```
npm install truffle-hdwallet-provider
```
### Development

```
truffle migrate --network development
⚠️  Important ⚠️
If you're using an HDWalletProvider, it must be Web3 1.0 enabled or your migration will hang.

Starting migrations...
======================
> Network name:    'development'
> Network id:      1548571685076
> Block gas limit: 6721975


2_deploy_contracts.js
=====================

   Deploying 'kyc'
   ---------------
   > transaction hash:    0xc7c95bbc785bd4900c961b0e1bbd04244ac7021bda9d0b9e6838a32a57cd2ddf
   > Blocks: 0            Seconds: 0
   > contract address:    0x969d2E2e8B44557B67cCcDE01fc10dCdd7Aa53eC
   > account:             0x80209212e19a8756484Ec01D1813B3D0A345bA8d
   > balance:             99.92131064
   > gas used:            3934468
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.07868936 ETH

   > Saving artifacts
   -------------------------------------
   > Total cost:          0.07868936 ETH


Summary
=======
> Total deployments:   1
> Final cost:          0.07868936 ETH

```
### Rinkeby network


* [deployed_addresses.txt](https://github.com/dev-bootcamp-2019/final-project-kannukartikeya/blob/master/deployed_addresses.txt) - rinkeby network deployment


### UI Flow

* [KYC-Blockchain_UI_Flow.pptx](https://github.com/dev-bootcamp-2019/final-project-kannukartikeya/blob/master/KYC-Blockchain_UI_Flow.pptx) 

UI uses Web Server for Chrome .

1. Please install Web server for Chrome (add on) as mentioned above.s

2. Do the following setup
* [ChromeWebServer_Setup.png](https://github.com/dev-bootcamp-2019/final-project-kannukartikeya/blob/master/ChromeWebServer_Setup.png)

3. Open http://127.0.0.1:8887/src/index.html for Bank Portal
   Open http://127.0.0.1:8887/src/indexCustomer.htmlfor Customer Portal
   
   (once root folder /final-project-kannukartikeya has successfully set in chrome web server)

Metamask integration can be done at all the places of transaction however avoided to keep evaluation simple.

Below integration screenshot and snippet to suggest that initially been done.

* [metamask_Signing.png](https://github.com/dev-bootcamp-2019/final-project-kannukartikeya/blob/master/metamask_Signing.png)

Mentioned below code snippet to inject metamask once it is installed on browser.

```
if (typeof web3 !== 'undefined') {
         // First, we check if there's a web3 instance already active.
         // Ethereum browsers like Mist or Chrome with the MetaMask extension
         // will inject their own web3 instances.
         // If an injected web3 instance is present,
         // we get its provider and use it to create our web3 object.
         web3Provider = web3.currentProvider;
		//overriding this since metamask is already installed however we are using truffle provider
	}
```

## Project Requirement
### User Interface Requirements
- [x] Run the app on a dev server locally for testing/grading
- [x] You should be able to visit a URL and interact with the application
- [x] App recognizes current account
- [x] Sign transactions using MetaMask or uPort
- [x] Contract state is updated
- [x] Update reflected in UI
### Test Requirements
- [x] Write 5 tests for each contract you wrote
- [x] Solidity or JavaScript
- [x] Explain why you wrote those tests
- [x] Tests run with truffle test
### Best Practices
- [x] Use a library or extend a contract 
- [x] Via EthPM or write your own
### Deployment
- [x] Deploy your application onto one of the test networks.
- [x] Include a document called [deployed_addresses.txt](deployed_addresses.txt) that describes where your contracts live (which testnet and address).
- [x] Students can verify their source code using Etherscan https://etherscan.io/verifyContract for the appropriate testnet.
- [x] Evaluators can check by getting the provided contract ABI and calling a function on the deployed contract at https://www.myetherwallet.com/#contracts or checking the verification on Etherscan.
### Stretch Requirements
- [x] Deploy contract on testnet
