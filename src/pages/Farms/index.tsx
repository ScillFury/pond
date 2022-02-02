import React from "react";
import styled from "styled-components";
import AppBody from "../AppBody";
import Filter from "../../components/farm/FarmList/filter";
import FarmList from "../../components/farm/FarmList";
import { useParams } from "react-router-dom";
import { SwapPoolTabs } from "../../components/NavigationTabs";
import { AppWrapper, AppWrapperInner } from "../../components/swap/styleds";
import MainCard from "../../components/MainCard";
import { ReactComponent as Arrow } from "../../assets/svg/arrow.svg";

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

const Link = styled.a`
  padding-left: 3px;
  font-weight: 500;
  font-size: 12px;
  line-height: 15px;
  color: #3ad889;
  text-decoration: none;
  :hover {
    text-decoration: underline;
  }
`;

export default function Farms() {
  const { networkId }: { networkId: string } = useParams();

  return (
    <AppBody>
      <AppWrapper>
        <AppWrapperInner>
          <SwapPoolTabs active={"farm"} />
          <MainCard>
            <div>
              <Header>Farm</Header>
              <SubHeader>Let&apos;s farm POND with your LP tokens!</SubHeader>
              <SubHeader>
                <Arrow />
                <Link
                  target="_blank"
                  href="https://tutorials.fuse.io/tutorials/fusefi-tutorials/what-are-lp-tokens"
                >
                  <span style={{ color: "darkgreen" }}>
                    What are LP Tokens?
                  </span>
                </Link>
              </SubHeader>
            </div>
            <Filter networkId={Number(networkId)} />
          </MainCard>
        </AppWrapperInner>
        <FarmList networkId={Number(networkId)} />
      </AppWrapper>
    </AppBody>
  );
}
