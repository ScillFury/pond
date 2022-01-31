import React, { useState, useCallback } from "react";
import { Text } from "rebass";
import { Link } from "react-router-dom";
import CurrencyInputPanel from "../../components/CurrencyInputPanel";
import { ButtonPrimary } from "../../components/Button";

import AppBody from "../AppBody";
import Question from "../../components/QuestionHelper";
import { AppWrapper, AppWrapperInner } from "../../components/swap/styleds";
import MainCard from "../../components/MainCard";
import { AutoColumn } from "../../components/Column";
import { RowBetween } from "../../components/Row";
import { TYPE } from "../../theme";

export default function StakeTokens() {
  const [stakedAmount, setStakedAmount] = useState<any>("");

  const onFieldInput = useCallback(
    (value: string) => {
      setStakedAmount(value);
    },
    [setStakedAmount]
  );

  return (
    <>
      <AppBody>
        <AppWrapper>
          <AppWrapperInner>
            <MainCard>
              <AutoColumn gap="lg" justify="center">
                <AutoColumn
                  gap="lg"
                  style={{ width: "100%", margin: "15px 0px" }}
                >
                  <RowBetween padding={"0 8px"}>
                    <Text
                      color="#7671a2"
                      fontWeight={500}
                      textAlign="center"
                      width={"100%"}
                    >
                      Stake Tokens
                    </Text>
                    <Question text="When you add to Staking Balance, you stake the amount in the farm. If you don’t see any balance, try adding some amount." />
                  </RowBetween>
                </AutoColumn>
                <AutoColumn
                  gap={"md"}
                  style={{ width: "100%", margin: "15px 0px" }}
                >
                  <TYPE.mediumHeader color="#7a7193" fontSize={16}>
                    Select Currency
                  </TYPE.mediumHeader>
                  <CurrencyInputPanel
                    bridge={true}
                    label="Amount"
                    value={stakedAmount}
                    onUserInput={onFieldInput}
                    currency={undefined}
                    showMaxButton={false}
                    id="stake-input-token"
                  />
                </AutoColumn>
              </AutoColumn>
              <AutoColumn gap="lg" justify="center">
                <ButtonPrimary
                  id="join-pool-button"
                  as={Link}
                  style={{ padding: 16, marginTop: 24 }}
                  to="/stake/POND"
                >
                  <Text fontWeight={500} fontSize={18} color="white">
                    Stake
                  </Text>
                </ButtonPrimary>
              </AutoColumn>
            </MainCard>
          </AppWrapperInner>
        </AppWrapper>
      </AppBody>
    </>
  );
}
