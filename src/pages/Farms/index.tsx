import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import AppBody from "../AppBody";
import { Currency } from "@fuseio/fuse-swap-sdk";
import { Text } from "rebass";
import Web3 from "web3";
import { darken } from "polished";

import { WrappedTokenInfo } from "../../state/lists/hooks";
import { useActiveWeb3React } from "../../hooks";
import { useCurrencyBalance } from "../../state/wallet/hooks";
import { AutoColumn } from "../../components/Column";
import { ButtonPrimary } from "../../components/Button";
import { SwapPoolTabs } from "../../components/NavigationTabs";
import { AppWrapper, AppWrapperInner } from "../../components/swap/styleds";
import MainCard from "../../components/MainCard";
import CurrencyInputPanel from "../../components/CurrencyInputPanel";

import PondToken from "../../abis/PondToken.json";
import TokenFarm from "../../abis/Farming.json";

const Header = styled.h1`
  font-size: 32px;
  font-weight: 600;
  margin: 0px;
  color: #77719f;
`;

const SubHeader = styled.div`
  font-size: 16px;
  margin-top: 0;
  color: #77719f;
  line-height: 28px;
`;

const ErrorButton = styled.div`
  min-height: 48px;
  border-radius: 8px;
  font-size: 16px;
  color: ${({ theme }) => theme.text1};
  background-color: salmon;
  padding: 0.5rem;
  font-weight: 600;
  user-select: none;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    cursor: pointer;
    background-color: ${({ theme }) => darken(0.1, theme.text4)};
  }
`;

export const Farms: React.FC<{}> = () => {
  const { networkId }: { networkId: string } = useParams();
  const { account } = useActiveWeb3React();

  const [pondToken, setPondToken] = useState<any>();
  const [stakingAmount, setStakingAmount] = useState<string>("");
  const [tokenFarm, setTokenFarm] = useState<any>();

  const [currency, setCurrency] = useState<WrappedTokenInfo | Currency>();
  const balance = useCurrencyBalance(account ?? undefined, currency);

  const [valid, setValid] = useState<{
    isValid: boolean;
    reason: string;
  }>({
    isValid: false,
    reason: "Stake Tokens",
  });

  const onFieldInput = (value: any) => {
    // if (currency && currency.symbol === "POND") {
      setStakingAmount(value);
    // }
  };

  const defaultCurrency = {decimals: 18, symbol: 'POND', name: 'Pond', chainId: 122, address: '0x26AA272c919AcFf6E9cBA444294599c5ec0Bcd39'} as WrappedTokenInfo;

  useEffect(() => {
    setCurrency(defaultCurrency);
  }, []);

  const handleCurrencySelect = useCallback((currency: Currency) => {
    const wrappedToken = currency as WrappedTokenInfo;
    setCurrency(wrappedToken);
  }, []);

  const validationForBalance = useCallback(() => {
    if (balance && currency && currency.symbol === "POND") {
      const tranformedBal = balance?.toSignificant(6);
      if (parseFloat(tranformedBal) >= parseFloat(stakingAmount)) {
        setValid({
          isValid: true,
          reason: "Stake tokens",
        });
      } else {
        setValid({
          isValid: false,
          reason: "Incorrect Amount",
        });
      }
    }
  }, [balance, currency, stakingAmount]);

  //Function to connect crypto wallet with the application
  const loadWeb3 = async () => {
    const eth: any = window.ethereum;
    if (eth) {
      window.web3 = new Web3(eth);
      await eth.enable();
    } else if (window.web3) {
      window.web3 = new Web3(eth.currentProvider);
    } else {
      console.log(
        "Non-ethereum browser detected. You should consider trying Metamask!"
      );
    }
  };

  //Function to get blockchain details->accounts, tokens.
  const loadBlockchainData = useCallback(async () => {
    const web3: any = window.web3;

    //Load Pond Token.
    const pondToken = new web3.eth.Contract(
      PondToken.abi,
      "0x0e6bef16cfA4A98D966F27E212Cc32630D3779e1"
    );
    if (pondToken) {
      setPondToken(pondToken);
    } else {
      console.log("PondToken contract not deployed to detect network.");
    }

    //Load TokenFarm.
    const tokenFarm = new web3.eth.Contract(
      TokenFarm.abi,
      "0xc47Aa79fC7Ec8c2aAee5EDddfA9da6200c112689"
    );
    if (tokenFarm) {
      setTokenFarm(tokenFarm);
    } else {
      console.log("TokenFarm contract not deployed to detect network.");
    }
  }, [networkId]);

  //Stake Pond Tokens.
  const stakeTokens = () => {
    const web3: any = window.web3;
    let amount = stakingAmount.toString();
    amount = web3.utils.toWei(amount, "Ether");
    pondToken.methods
      .approve(tokenFarm._address, amount)
      .send({ from: account })
      .on("transactionHash", (hash: any) => {
        tokenFarm.methods
          .stakeTokens(amount)
          .send({ from: account })
          .on("transactionHash", (hash: any) => {
            console.log("Transaction success.");
          });
      });
  };

  //Withdraw Pond Tokens.
  const withdrawTokens = () => {
    tokenFarm.methods
      .unstakeTokens()
      .send({ from: account })
      .on("transactionHash", (hash: any) => {
        console.log("Transaction success.");
      });
  };

  useEffect(() => {
    if (stakingAmount) {
      validationForBalance();
    }
  }, [stakingAmount]);

  useEffect(() => {
    loadWeb3();
  }, []);

  useEffect(() => {
    if (account) {
      loadBlockchainData();
    }
  }, [account, loadBlockchainData]);

  return (
    <AppBody>
      <AppWrapper>
        <AppWrapperInner>
          <SwapPoolTabs active={"farm"} />
          <MainCard>
            <div>
              <Header>Farm</Header>
              <SubHeader>Let&apos;s farm POND tokens!</SubHeader>
              <Text fontSize={16} fontWeight={500} color="#7671a2">
                We're currently only accepting POND tokens for farm.
              </Text>
            </div>
            <AutoColumn gap={"lg"} style={{ margin: "1.5rem auto" }}>
              <CurrencyInputPanel
                value={stakingAmount}
                onUserInput={onFieldInput}
                onCurrencySelect={handleCurrencySelect}
                showMaxButton={false}
                currency={currency}
                id="add-farming-token-input"
                showCommonBases
              />
            </AutoColumn>
            <AutoColumn
              gap={"lg"}
              style={{ margin: "1rem auto", marginTop: "2rem" }}
            >
              <ButtonPrimary
                onClick={stakeTokens}
                disabled={!valid.isValid}
                width="100%"
              >
                <Text fontSize={16} fontWeight={500} color="#ffffff">
                  {valid.reason}
                </Text>
              </ButtonPrimary>
            </AutoColumn>
            <AutoColumn
              gap={"lg"}
              style={{ margin: "1rem auto", marginTop: "1rem" }}
            >
              <ErrorButton onClick={withdrawTokens}>
                <Text fontSize={16} fontWeight={500} color="#ffffff">
                  Withdraw tokens
                </Text>
              </ErrorButton>
            </AutoColumn>
          </MainCard>
        </AppWrapperInner>
      </AppWrapper>
    </AppBody>
  );
};

export default Farms;
