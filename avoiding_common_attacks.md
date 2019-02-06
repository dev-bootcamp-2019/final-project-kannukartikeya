Avoiding common attacks
1. Re-entrancy
Owned contract is inherited so that only the onwer can destruct smart contract.

2. Integer overflow/underflow
The SafeMath library by OpenZeppelin has been implemented to control addition/subtraction of the counters in addBank/RemoveBank. 
It has not been implemented everywhere and have done only few places as intention was to learn.