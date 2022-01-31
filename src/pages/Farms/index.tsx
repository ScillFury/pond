import React, { useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import { Text } from "rebass";
import styled, { ThemeContext } from "styled-components";
import { Pair } from '@fuseio/fuse-swap-sdk'

import { TYPE } from "../../theme";
import AppBody from "../AppBody";
import { useActiveWeb3React, useChain } from "../../hooks";

import FullPositionCard from "../../components/PositionCard";
import { ButtonPrimary } from "../../components/Button";
import { SwapPoolTabs } from "../../components/NavigationTabs";
import { RowBetween } from "../../components/Row";
import { UNDER_MAINTENANCE } from "../../constants";
import { AutoColumn } from "../../components/Column";
import { LightCard } from "../../components/Card";
import {
  AppWrapper,
  AppWrapperInner,
  Dots,
} from "../../components/swap/styleds";
import Question from "../../components/QuestionHelper";
import SwitchNetwork from "../../components/swap/SwitchNetwork";
import Maintenance from "../../components/swap/Maintenance";
import MainCard from "../../components/MainCard";
import FarmInfo from "../../components/farm/FarmInfo";

import { usePairs } from "../../data/Reserves";
import {
  toV2LiquidityToken,
  useTrackedTokenPairs,
} from "../../state/user/hooks";
import { useTokenBalancesWithLoadingIndicator } from "../../state/wallet/hooks";

const DarkCard = styled(LightCard)`
  background: #ede9f7;
  border: 0;
  font-weight: 500;
`;

export default function Farms() {
  const theme = useContext(ThemeContext);
  const { isHome } = useChain();
  const { account } = useActiveWeb3React();

  const trackedTokenPairs = useTrackedTokenPairs();
  const tokenPairsWithLiquidityTokens = useMemo(
    () =>
      trackedTokenPairs.map((tokens) => ({
        liquidityToken: toV2LiquidityToken(tokens),
        tokens,
      })),
    [trackedTokenPairs]
  );
  const liquidityTokens = useMemo(
    () => tokenPairsWithLiquidityTokens.map((tpwlt) => tpwlt.liquidityToken),
    [tokenPairsWithLiquidityTokens]
  );
  const [
    v2PairsBalances,
    fetchingV2PairBalances,
  ] = useTokenBalancesWithLoadingIndicator(
    account ?? undefined,
    liquidityTokens
  );
  // fetch the reserves for all V2 pools in which the user has a balance
  const liquidityTokensWithBalances = useMemo(
    () =>
      tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
        v2PairsBalances[liquidityToken.address]?.greaterThan("0")
      ),
    [tokenPairsWithLiquidityTokens, v2PairsBalances]
  );
  const v2Pairs = usePairs(
    liquidityTokensWithBalances.map(({ tokens }) => tokens)
  );
  const v2IsLoading =
    fetchingV2PairBalances ||
    v2Pairs?.length < liquidityTokensWithBalances.length ||
    v2Pairs?.some((V2Pair) => !V2Pair);

  const allV2PairsWithLiquidity = v2Pairs
    .map(([, pair]) => pair)
    .filter((v2Pair): v2Pair is Pair => Boolean(v2Pair));


  if (UNDER_MAINTENANCE) {
    return <Maintenance />;
  }

  if (!isHome) {
    return (
      <>
        <AppBody>
          <AppWrapper>
            <AppWrapperInner>
              <SwapPoolTabs active={"pool"} />
              <MainCard>
                <SwitchNetwork />
              </MainCard>
            </AppWrapperInner>
          </AppWrapper>
        </AppBody>
      </>
    );
  }

  return (
    <>
      <AppBody>
        <AppWrapper>
          <AppWrapperInner>
            <SwapPoolTabs active={"farm"} />
            <MainCard>
              <AutoColumn gap="lg" justify="center">
                <ButtonPrimary
                  id="join-pool-button"
                  as={Link}
                  style={{ padding: 16, marginBottom: 24 }}
                  to="/stake/POND"
                >
                  <Text fontWeight={500} fontSize={18} color="white">
                    Stake Tokens
                  </Text>
                </ButtonPrimary>
              </AutoColumn>
              <AutoColumn gap="12px" style={{ width: "100%" }}>
                <RowBetween padding={"0 8px"}>
                  <Text color="#7671a2" fontWeight={500}>
                    Your Staking Balance
                  </Text>
                  <Question text="When you add to Staking Balance, you stake the amount in the farm. If you don’t see any balance, try adding some amount." />
                </RowBetween>
                {!account ? (
                  <DarkCard padding="30px">
                    <TYPE.body
                      color="#7671a2"
                      fontSize={14}
                      fontWeight="500"
                      textAlign="center"
                    >
                      Connect to a wallet to view your balance.
                    </TYPE.body>
                  </DarkCard>
                ) : v2IsLoading ? (
                  <DarkCard padding="30px">
                    <TYPE.body
                      color="#7671a2"
                      fontSize={14}
                      fontWeight="500"
                      textAlign="center"
                    >
                      <Dots>Loading</Dots>
                    </TYPE.body>
                  </DarkCard>
                ) : allV2PairsWithLiquidity?.length > 0 ? (
                  <>
                    {allV2PairsWithLiquidity.map((v2Pair) => (
                      <FullPositionCard
                        key={v2Pair.liquidityToken.address}
                        pair={v2Pair}
                      />
                    ))}
                  </>
                ) : (
                  <DarkCard padding="30px">
                    <TYPE.body
                      color={theme.text2}
                      fontSize={14}
                      fontWeight="500"
                      textAlign="center"
                    >
                      No staked amount found.
                    </TYPE.body>
                  </DarkCard>
                )}
                <FarmInfo />
              </AutoColumn>
            </MainCard>
          </AppWrapperInner>
        </AppWrapper>
      </AppBody>
    </>
  );
}
