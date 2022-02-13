// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import "./PondToken.sol";

contract Farming {
  //All smart contract logic goes here...
  string public name = "Farm";
  address public owner;
  PondToken public pondToken;
  address public rewardAddress;
  address[] public stakers;
  mapping(address => uint) public stakingBalance;
  mapping(address => uint) public stakingTime;
  mapping(address => bool) public hasStaked;

  constructor(PondToken _pondToken) {
    pondToken = _pondToken;
    owner = msg.sender;
    rewardAddress = msg.sender;
  }

  //1. Stake Tokens (Deposit)
  function stakeTokens(uint _amount) public {
    //Check for minimum amount.
    require(_amount > 0, "amount cannot be 0");

    //Transfer POND tokens from investor to this contract for STAKING.
    //Edit: LP tokens will be transferred from investor to this contract for STAKING.
    pondToken.transferFrom(msg.sender, address(this), _amount);

    uint balance;
    uint reward;
    (balance, reward) = getRewardTokens();
    pondToken.transfer(msg.sender, reward);
    //Update Staking Balance
    stakingBalance[msg.sender] = balance + _amount;
    stakingTime[msg.sender] = block.timestamp;

    //Add user to stakers array if they haven't staked already.
    if(!hasStaked[msg.sender]) {
      stakers.push(msg.sender);
    }

    //Update a users' staking status
    hasStaked[msg.sender] = true;
  }

  //2. Issuing Tokens (Interest)
  function issueTokens() public {
    require(msg.sender == owner, "not owner");
    for(uint i=0; i<stakers.length; i++) {
      address recipient = stakers[i];
      uint balance = stakingBalance[recipient];
      if(balance > 0) {
        pondToken.transfer(recipient, balance);
      }
    }
  }

  //3. get staked amount and reward amount 
  function getRewardTokens() public view returns(uint, uint){
    uint balance = stakingBalance[msg.sender];
    if (balance == 0){
      return (0, 0);
    }
    uint lastTime = stakingTime[msg.sender];
    uint reward = balance * (block.timestamp - lastTime) * 100 / 365 days;
    return (balance, reward);
  }

  //4. Un-Stake Tokens (Withdraw)
  function unstakeTokens() public {
    uint balance; uint reward;
    (balance, reward) = getRewardTokens();
    require(balance > 0, "Staking Balance cannot be 0.");
    pondToken.transfer(msg.sender, balance);
    pondToken.transferFrom(rewardAddress, msg.sender, reward);

    stakingBalance[msg.sender] = 0;
    hasStaked[msg.sender] = false;
  }

  //5. set reward address
  function setRewardAddress(address _addr) public {
    require(msg.sender == owner, "not owner");
    require(_addr != address(0), "invalid address");
    rewardAddress = _addr;
  }
}
