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
-
## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

npm version is >= 5.6.0

Truffle v5.0.1 (core: 5.0.1)

Solidity v0.5.0 (solc-js)

Ganache CLI v6.1.0 (ganache-core: 2.1.0)

Node v9.11.1

```
npm install -g truffle
npm install -g ganache-cli
```

### Installing

Start Ganache
```
ganache-cli
```

Move to the project root and run truffle cmds:
```
truffle compile
truffle migrate
truffle test
```

End with an example of getting some data out of the system or using it for a little demo

## Running the tests

Move to the project root and run truffle cmds:

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

### Break down into end to end tests

Explain what these tests test and why

```
Give an example
```

### And coding style tests

Explain what these tests test and why

```
Give an example
```

## Deployment

Add additional notes about how to deploy this on a live system

## Built With

* [Dropwizard](http://www.dropwizard.io/1.0.2/docs/) - The web framework used
* [Maven](https://maven.apache.org/) - Dependency Management
* [ROME](https://rometools.github.io/rome/) - Used to generate RSS Feeds






## Project Requirements
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
### Design Pattern Requirements
- [x] Implement a circuit breaker (emergency stop) pattern
- [x] What other design patterns have you used / not used?
- [x] Why did you choose the patterns that you did?
- [x] Why not others?
### Security Tools / Common Attacks
- [x] Explain what measures you’ve taken to ensure that your contracts are not susceptible to common attacks
- [x] Use a library or extend a contract
- [x] Via EthPM or write your own
### Stretch Requirements
- [x] Deploy contract on testnet
- [x] Add functionality that allows store owners to create an auction
- [x] Implement functionality of ERC20 
- [x] Implement an upgradable design pattern (Asset Registration is Upgradable and following Eternal Storage standard)
- [] Use Ethereum Name Service
- [ ] Write a smart contract in LLL or Vyper
- [ ] Use uPort
- [ ] Use IPFS
- [ ] Use Oracle