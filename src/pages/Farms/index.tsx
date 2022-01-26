/*
import React from 'react'
import styled from 'styled-components'
import AppBody from '../AppBody'
import Filter from '../../components/farm/FarmList/filter'
import FarmList from '../../components/farm/FarmList'
import { useParams } from 'react-router-dom'
import { ReactComponent as Arrow } from '../../assets/svg/arrow.svg'
import { ReactComponent as LinkIcon } from '../../assets/svg/link.svg'

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  width: 100%;
  padding-left: 5%;
  padding-right: 5%;
  margin-bottom: 45px;
  text-align: left;
  min-height: 80vh;
  justify-content: flex-start;
`

const Header = styled.h1`
  font-size: 32px;
  font-weight: 600;
  margin: 0px;
  color: #77719f;
`

const SubHeader = styled.div`
  font-size: 16px;
  margin-top: 0;
  color: #77719f;
  line-height: 28px;
`

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  flex-wrap: wrap;
  margin-top: 50px;

`

const Link = styled.a`
  padding-left: 3px;
  font-weight: 500;
  font-size: 12px;
  line-height: 15px;
  color: #3AD889;
  text-decoration: none;
  :hover{
    text-decoration: underline;
  }
`
const Text = styled.a`
  display: block;
  font-weight: 500;
  font-family: 'Inter';
  font-size: 13px;
  line-height: 14px;
  text-align: right;
  color: #f3fc1f;
  text-decoration: none;
  :hover {
    text-decoration: underline;
  }
`

export default function Farms() {
  const { networkId }: { networkId: string } = useParams()

  return (
    <AppBody>
      <Container>
        <Wrapper>
          <div>
            <Header>Farm</Header>
            <SubHeader>Let&apos;s farm FUSE and VOLT with your LP tokens!</SubHeader>
            <SubHeader>
              <Arrow />
              <Link href="https://tutorials.fuse.io/tutorials/fusefi-tutorials/what-are-lp-tokensgit">
                <span style={{ color: 'darkgreen' }}>What are LP Tokens?</span>
              </Link>
            </SubHeader>
          </div>
          <Filter networkId={Number(networkId)} />
        </Wrapper>
        <FarmList networkId={Number(networkId)} />
        <Text href="https://oldrewards.fuse.io/">
          Old farming page <LinkIcon />
        </Text>
      </Container>
    </AppBody>
  )
}
*/

import React from 'react'
import { SwapPoolTabs } from '../../components/NavigationTabs'

import { AutoColumn } from '../../components/Column'

import { useChain } from '../../hooks'
import AppBody from '../AppBody'
import { AppWrapper, AppWrapperInner } from '../../components/swap/styleds'
import SwitchNetwork from '../../components/swap/SwitchNetwork'
import { UNDER_MAINTENANCE } from '../../constants'
import Maintenance from '../../components/swap/Maintenance'
import MainCard from '../../components/MainCard'


export default function Farms() {
  const { isHome } = useChain()

  if (UNDER_MAINTENANCE) {
    return <Maintenance />
  }

  if (!isHome) {
    return (
      <>
        <AppBody>
          <AppWrapper>
            <AppWrapperInner>
              <SwapPoolTabs active={'pool'} />
              <MainCard>
                <SwitchNetwork />
              </MainCard>
            </AppWrapperInner>
          </AppWrapper>
        </AppBody>
      </>
    )
  }

  return (
    <>
      <AppBody>
        <AppWrapper>
          <AppWrapperInner>
            <SwapPoolTabs active={'farm'} />
            <MainCard>
              <AutoColumn gap="lg" justify="center">
                <span>&nbsp;</span>
              </AutoColumn>
            </MainCard>
          </AppWrapperInner>
        </AppWrapper>
      </AppBody>
    </>
  )
}
