// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import "./PondToken.sol";

contract Farming {
  //All smart contract logic goes here...
  string public name = "Farm";
  address public owner;
  PondToken public pondToken;

  address[] public stakers;
  mapping(address => uint) public stakingBalance;
  mapping(address => bool) public hasStaked;

  constructor(PondToken _pondToken) {
    pondToken = _pondToken;
    owner = msg.sender;
  }

  //1. Stake Tokens (Deposit)
  function stakeTokens(uint _amount) public {
    //Check for minimum amount.
    require(_amount > 0, "amount cannot be 0");

    //Transfer POND tokens from investor to this contract for STAKING.
    pondToken.transferFrom(msg.sender, address(this), _amount);

    //Update Staking Balance
    stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;

    //Add user to stakers array if they haven't staked already.
    if(!hasStaked[msg.sender]) {
      stakers.push(msg.sender);
    }

    //Update a users' staking status
    hasStaked[msg.sender] = true;
  }

  //2. Issuing Tokens (Interest)
  function issueTokens() public {
    require(msg.sender == owner);
    for(uint i=0; i<stakers.length; i++) {
      address recipient = stakers[i];
      uint balance = stakingBalance[recipient];
      if(balance > 0) {
        pondToken.transfer(recipient, balance);
      }
    }
  }

  //3. Un-Stake Tokens (Withdraw)
  function unstakeTokens() public {
    uint balance = stakingBalance[msg.sender];
    require(balance > 0, "Staking Balance cannot be 0.");
    pondToken.transfer(msg.sender, balance);

    stakingBalance[msg.sender] = 0;
    hasStaked[msg.sender] = false;
  }
}