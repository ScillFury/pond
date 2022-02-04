import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import AppBody from "../AppBody";
import { Currency } from "@fuseio/fuse-swap-sdk";
import { WrappedTokenInfo } from "../../state/lists/hooks";
import { useActiveWeb3React } from "../../hooks";
import { useCurrencyBalance } from "../../state/wallet/hooks";
import { AutoColumn } from "../../components/Column";
import { ButtonPrimary } from "../../components/Button";
import { Text } from "rebass";

import { SwapPoolTabs } from "../../components/NavigationTabs";
import { AppWrapper, AppWrapperInner } from "../../components/swap/styleds";
import MainCard from "../../components/MainCard";
import CurrencyInputPanel from "../../components/CurrencyInputPanel";

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

export const Farms: React.FC<{}> = () => {
  const { account } = useActiveWeb3React();

  const [currency, setCurrency] = useState<WrappedTokenInfo | Currency>();
  const [tokenAmount, setTokenAmount] = useState<string>("");
  const balance = useCurrencyBalance(account ?? undefined, currency);
  const [valid, setValid] = useState<{
    isValid: boolean;
    reason: string;
  }>({
    isValid: false,
    reason: "Stake Tokens",
  });

  useEffect(() => {
    validationForBalance();
  }, [tokenAmount]);

  const onFieldInput = (value: any) => {
    if (currency && currency.symbol === "POND") {
      setTokenAmount(value);
    }
  };

  const handleCurrencySelect = useCallback((currency: Currency) => {
    const wrappedToken = currency as WrappedTokenInfo;
    setCurrency(wrappedToken);
  }, []);

  const validationForBalance = () => {
    if (balance && currency && currency.symbol === "POND") {
      const tranformedBal = balance?.toSignificant(6);
      if (parseFloat(tranformedBal) >= parseFloat(tokenAmount)) {
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
  };

  const handleSubmit = () => {
    console.log("Amount: ");
    console.log(tokenAmount);
  };

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
                value={tokenAmount}
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
                onClick={handleSubmit}
                disabled={!valid.isValid}
                width="100%"
              >
                <Text fontSize={16} fontWeight={500} color="#ffffff">
                  {valid.reason}
                </Text>
              </ButtonPrimary>
            </AutoColumn>
          </MainCard>
        </AppWrapperInner>
      </AppWrapper>
    </AppBody>
  );
};

export default Farms;
