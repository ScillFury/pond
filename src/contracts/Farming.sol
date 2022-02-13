// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import "./PondToken.sol";

contract Farming {
  string public name = "Farm";
  uint public apy;
  address public owner;
  PondToken public pondToken;
  // address public rewardAddress;
  address[] public stakers;
  mapping(address => uint) public stakingBalance;
  mapping(address => uint) public stakingTime;
  mapping(address => bool) public hasStaked;

  constructor(PondToken _pondToken) {
    pondToken = _pondToken;
    owner = msg.sender;
    // rewardAddress = msg.sender;
    apy=10000;
  }

  //1. get staked amount and reward amount
  function getRewardTokens() public view returns(uint, uint){
    uint balance = stakingBalance[msg.sender];
    if (balance == 0){
      return (0, 0);
    }
    uint lastTime = stakingTime[msg.sender];
    uint reward = balance * (block.timestamp - lastTime) * apy/100 / 365 days;
    return (balance, reward);
  }

  //2. Stake Tokens (Deposit)
  function stakeTokens(uint _amount) public {
    require(_amount > 0, "amount cannot be 0");
    pondToken.transferFrom(msg.sender, address(this), _amount);
    uint balance;
    uint reward;
    (balance, reward) = getRewardTokens();
    pondToken.transfer(msg.sender, reward);

    //Update Staking Balance and Time
    stakingBalance[msg.sender] = balance + _amount;
    stakingTime[msg.sender] = block.timestamp;

    //Add user to stakers array if they haven't staked already.
    if(!hasStaked[msg.sender]) {
      stakers.push(msg.sender);
    }

    //Update a users' staking flag
    hasStaked[msg.sender] = true;
  }

  //3. Issuing Tokens
  function issueTokens() public {
    require(msg.sender == owner, "not owner");
    for(uint i=0; i<stakers.length; i++) {
      address recipient = stakers[i];
      uint balance = stakingBalance[recipient];
      if(balance > 0) {
        // staked token transfer 
        // pondToken.transfer(recipient, balance);
        uint lastTime = stakingTime[recipient];
        uint reward = balance * (block.timestamp - lastTime) * apy/100 / 365 days;
        // reward token transfer
        pondToken.transfer(recipient, balance + reward);
        stakingBalance[recipient] = 0;
        hasStaked[recipient] = false;
      }
    }
  }

  //4. Un-Stake Tokens (Withdraw)
  //Users unstake their tokens and get reward tokens too.
  function unstakeTokens() public {
    uint balance; uint reward;
    (balance, reward) = getRewardTokens();
    require(balance > 0, "Staking Balance cannot be 0.");
    pondToken.transfer(msg.sender, balance + reward);
    // pondToken.transferFrom(rewardAddress, msg.sender, reward);
    stakingBalance[msg.sender] = 0;
    hasStaked[msg.sender] = false;
  }

  //5. owner set reward address
  // function setRewardAddress(address _addr) public {
  //   require(msg.sender == owner, "not owner");
  //   require(_addr != address(0), "invalid address");
  //   rewardAddress = _addr;
  // }

  //6. owner set apy
  function setAPY(uint _apy) public {
    require(msg.sender == owner, "not owner");
    apy = _apy;
  }
}
