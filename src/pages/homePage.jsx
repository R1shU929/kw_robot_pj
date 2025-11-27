// src/pages/HomePage.jsx
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Logo from '../components/Logo.jsx'

function HomePage() {
  const navigate = useNavigate()

  // TODO: OpenCV에서 얼굴 인식 완료 시 true로 바꾸기
  const [faceRecognized] = useState(false)

  return (
    <Wrapper>
      {/* 상단바 */}
      <TitleBar>
        <TitleInner>
        <LogoButton onClick={() => navigate('/')}>
          <Logo />
        </LogoButton>

        <NavArea>
          <NavItem onClick={() => navigate('/attendance')}>출석부</NavItem>
        </NavArea>
        </TitleInner>
      </TitleBar>

      <SemiTitleBar>
        <SemiTitle>로봇학입문 (I000-1-6241-01) - 박수한</SemiTitle>
      </SemiTitleBar>

      <ContentWrapper>
        <ContentInner>
          <PageTitle>로봇 출석 시스템</PageTitle>

          {/* 나중에 카메라 / CV 화면 들어갈 자리 */}
          <Card>
            <CardHeader>
              <CardTitle>카메라 대기 화면</CardTitle>
              <CardBadge>대기중</CardBadge>
            </CardHeader>

            <CardText>
              지금은 기본 빈 화면입니다. 추후 OpenCV 모듈을 연동하면
              <br />
              <strong>움직임 인식 → 얼굴 인식</strong> 화면으로 전환됩니다.
            </CardText>
          </Card>

          {/* 얼굴 인식 후에만 띄우는 안내 배너 */}
          {faceRecognized && (
            <FaceNotice>
              얼굴 인식이 완료된 후{' '}
              <strong>15분 내로 입실하지 않으면 결석 처리됩니다.</strong>
            </FaceNotice>
          )}
        </ContentInner>
      </ContentWrapper>
    </Wrapper>
  )
}

export default HomePage

/* styled-components */

const Wrapper = styled.div`
  width: 100vw;
  min-height: 100vh;
  background-color: #dddddd99;
`

const TitleBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #3a051f;
  height: 80px;
  position: sticky;
  top: 0;
  z-index: 10;

  @media (max-width: 480px) {
    height: 64px;
    padding: 0 16px;
  }
`

const LogoButton = styled.button`
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
`

const NavArea = styled.nav`
  display: flex;
  align-items: center;
  gap: 24px;

  @media (max-width: 480px) {
    gap: 16px;
  }
`

const NavItem = styled.button`
  border: none;
  background: none;
  color: #ffffffdd;
  font-size: 0.95rem;
  cursor: pointer;
  padding: 6px 14px;
  border-radius: 999px;
  transition: background-color 0.2s ease, transform 0.1s ease;

  &:hover {
    background-color: #ffffff22;
    transform: translateY(-1px);
  }

  @media (max-width: 480px) {
    font-size: 0.85rem;
    padding: 4px 10px;
  }
`

const SemiTitleBar = styled.div`
  display: flex;
  align-items: center;
  background-color: #b10058;
  height: 37px;
  position: sticky;
  top: 80px;
  z-index: 9;
  padding: 0 50px;

  @media (max-width: 480px) {
    top: 64px;
    height: 32px;
    padding: 0 16px;
  }
`
const TitleInner = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;

  @media (max-width: 480px) {
    gap: 16px;
  }
`

const SemiTitle = styled.h2`
  font-weight: 500;
  font-size: 1rem;
  color: white;

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`

const ContentWrapper = styled.div`
  padding: 120px 0 40px;
  display: flex;
  justify-content: center;

  @media (max-width: 480px) {
    padding: 16px 0 24px;
    justify-content: flex-start;
  }
`

const ContentInner = styled.div`
  width: 960px;

  @media (max-width: 480px) {
    width: 100%;
    padding: 0 16px;
    box-sizing: border-box;
  }
`

const PageTitle = styled.h1`
  font-size: 26px;
  margin: 0 0 16px;

  @media (max-width: 480px) {
    font-size: 20px;
    margin-bottom: 12px;
  }
`

const Card = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 20px 20px 22px;
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (max-width: 480px) {
    border-radius: 14px;
    padding: 16px 14px 18px;
  }
`

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const CardTitle = styled.h2`
  font-size: 20px;
  margin: 0;

  @media (max-width: 480px) {
    font-size: 18px;
  }
`

const CardBadge = styled.span`
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.8rem;
  border: 1px solid #b10058;
  color: #b10058;
`

const CardText = styled.p`
  margin: 0;
  line-height: 1.6;
  color: #333;
  font-size: 0.95rem;

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`

// 얼굴 인식 완료 안내 배너 (캡처 느낌 동일)
const FaceNotice = styled.div`
  width: 100%;
  margin-top: 16px;
  padding: 16px 22px;
  border-radius: 999px;
  border: 1px solid #f5a3c4;
  background-color: #fff6f9;
  color: #222;
  font-size: 0.95rem;
  line-height: 1.6;
  box-sizing: border-box;

  @media (max-width: 480px) {
    padding: 12px 16px;
    font-size: 0.9rem;
  }
`
