// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import "./PondToken.sol";

contract Farming {
  //All smart contract logic goes here...

  //This is name
  string public name = "Farm";
  //APY   
  uint public apy;
  //owner address
  address public owner;
  //Pond token address
  PondToken public pondToken;
  //reward address. we give reward tokens to our usres from this address
  address public rewardAddress;
  //all stakers 
  address[] public stakers;
  //staking amount for each user
  mapping(address => uint) public stakingBalance;
  //last staking time for each user
  mapping(address => uint) public stakingTime;
  //flag setting whether user staked or not
  mapping(address => bool) public hasStaked;

  //In consturcture we set Pond token address and set owner as deployer, and set rewardAddress as deployer(this can be changed later). And set apy as 10000%(this can be changed later).
  constructor(PondToken _pondToken) {
    pondToken = _pondToken;
    owner = msg.sender;
    rewardAddress = msg.sender;
    apy=10000;
  }

  //1. Stake Tokens (Deposit)
  function stakeTokens(uint _amount) public {
    //Check for minimum amount.
    require(_amount > 0, "amount cannot be 0");

    //Transfer POND tokens from investor to this contract for STAKING.
    pondToken.transferFrom(msg.sender, address(this), _amount);

    //Users stake now, so give reward tokens assigned to him/her until now.
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

  //2. Issuing Tokens
  // This function can be called only by owner.
  // We give back to all users thier reward tokens and staked tokens.    
  function issueTokens() public {
    require(msg.sender == owner, "not owner");
    for(uint i=0; i<stakers.length; i++) {
      address recipient = stakers[i];
      uint balance = stakingBalance[recipient];
      if(balance > 0) {
        // staked token transfer 
        pondToken.transfer(recipient, balance);
        uint lastTime = stakingTime[recipient];
        uint reward = balance * (block.timestamp - lastTime) * apy/100 / 365 days;
        // reward token transfer
        pondToken.transferFrom(rewardAddress, recipient, reward);
        stakingBalance[recipient] = 0;
        hasStaked[recipient] = false;
      }
    }
  }

  //3. get staked amount and reward amount
  // This function returns the staked amount and reward amount assigned to users so far. 
  function getRewardTokens() public view returns(uint, uint){
    uint balance = stakingBalance[msg.sender];
    if (balance == 0){
      return (0, 0);
    }
    uint lastTime = stakingTime[msg.sender];
    uint reward = balance * (block.timestamp - lastTime) * apy/100 / 365 days;
    return (balance, reward);
  }

  //4. Un-Stake Tokens (Withdraw)
  //Users unstake their tokens and get reward tokens too.
  function unstakeTokens() public {
    uint balance; uint reward;
    (balance, reward) = getRewardTokens();
    require(balance > 0, "Staking Balance cannot be 0.");
    pondToken.transfer(msg.sender, balance);
    pondToken.transferFrom(rewardAddress, msg.sender, reward);

    stakingBalance[msg.sender] = 0;
    hasStaked[msg.sender] = false;
  }

  //5. owner set reward address
  function setRewardAddress(address _addr) public {
    require(msg.sender == owner, "not owner");
    require(_addr != address(0), "invalid address");
    rewardAddress = _addr;
  }

  //6. owner set apy
  function setAPY(uint _apy) public {
    require(msg.sender == owner, "not owner");
    apy = _apy;
  }
}
