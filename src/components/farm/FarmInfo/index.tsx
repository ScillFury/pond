import React, { useState } from "react";
import styled from "styled-components";
import InfoPanel from "../FarmTabs/infoPanel";
import vector from "../../../assets/svg/vector.svg";
import rewards from "../../../assets/svg/rewardsAcc.svg";
import Modal from "../../Modal";
import PurpleQuestionmarkIcon from "../../../assets/svg/questionmark-purple.svg";
import apyPurple from "../../../assets/svg/questionmark.svg";
import apyLightGreen from "../../../assets/svg/questionmark2.svg";
import apyGreen from "../../../assets/svg/questionmark3.svg";
import depositIcon from "../../../assets/svg/deposits.svg";
import FarmTabs from "../FarmTabs";
import { useFarm } from "../../../state/farm/hooks";
import { tryFormatAmount, tryFormatDecimalAmount } from "../../../utils";

const Container = styled("div")`
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding-left: 24%;
  padding-right: 24%;
  text-align: left;
  z-index: 3;
  > span {
    font-size: 32px;
    font-weight: 600;
    line-height: 38px;
  }

  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding-left: 1rem;
    padding-right: 1rem;
  `}
`;

const Wrapper = styled("div")`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  > span {
    font-size: 32px;
    font-weight: 600;
  }
`;
const TabsWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;

  > span {
    font-size: 32px;
    font-weight: 600;
  }
`;

const Item = styled("div")`
  padding: 4px;
  width: 33%;
  @media only screen and (max-width: 768px) {
    width: 100%;
  }
`;

const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #393c57;
  height: 24px;
  width: 24px;
  border-radius: 50%;
  cursor: pointer;
`;
export const StyledModal = styled.div`
  z-index: 100;
  padding: 1rem;
  background: #242637;
  position: relative;
  margin: auto;
  border-radius: 12px;
`;
export const Content = styled.div`
  padding-bottom: 15px;
  max-height: 30rem;
  > h1 {
    font-size: 24px;
    font-weight: 600;
  }
  > p {
    font-size: 14px;
    font-weight: 400;
    line-height: 21px;
  }
  > span {
    color: rgb(118, 113, 162);
  }
`;

export default function Farm() {
  const [isOpen, setOpen] = useState(false);
  const address = "";
  const farm: any = useFarm(address);

  return (
    <Container>
      <Wrapper
        onClick={() => {
          setOpen(true);
        }}
        style={{ alignItems: "center" }}
      >
        <IconWrapper>
          <img
            className="purple-icon"
            src={PurpleQuestionmarkIcon}
            width="15px"
            height="15px"
            alt="Bridge Logo"
          />
        </IconWrapper>
        <span>Read more</span>
      </Wrapper>
      <Modal
        maxHeight={95}
        isOpen={isOpen}
        maxWidth="640px"
        onDismiss={() => {
          setOpen(false);
        }}
      >
        <StyledModal>
          <Content>
            <Item>
              <InfoPanel
                title="Deposit APY"
                data={(farm?.rewardsInfo[0].apyPercent * 100).toFixed(2)}
                icon={vector}
                apyIcon={apyPurple}
                label="%"
                txt="#8E6CC0"
                color="#473660"
                content='APY - Annual Percentage Yield (APY) is the estimated yearly yield for tokens locked. Our calculation is " $ locked * (1 year in second)/(total stake in $ * time remaining in seconds).'
              />
            </Item>
            <Item>
              <InfoPanel
                title="Your Deposits"
                data={tryFormatDecimalAmount(farm?.totalStaked, 18, 2) ?? "0"}
                icon={depositIcon}
                apyIcon={apyLightGreen}
                label={` ${farm?.pairName}`}
                txt="#0684A6"
                color="#034253"
                content="Your Deposits - Your deposits shows the total amount of FUSE you have deposited into the Staking Contract."
              />
            </Item>
            <Item>
              <InfoPanel
                title="Accrued Rewards"
                data={
                  tryFormatAmount(farm?.rewardsInfo[0]?.accuruedRewards, 18) ??
                  ""
                }
                apyIcon={apyGreen}
                label=" WFUSE"
                icon={rewards}
                txt="#1C9E7E"
                color="#0E4F3F"
                content="Accrued Rewards - Accrued Rewards refers to the total FUSE you've earned for your stake"
              />
            </Item>
            <TabsWrapper>
              <FarmTabs farm={farm} />
            </TabsWrapper>
          </Content>
        </StyledModal>
      </Modal>
    </Container>
  );
}
