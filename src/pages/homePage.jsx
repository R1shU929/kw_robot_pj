// src/pages/HomePage.jsx
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Logo from '../components/Logo.jsx'
import FaceCamera from '../components/FaceCamera.jsx'

function HomePage() {
  const navigate = useNavigate()

  // 얼굴 인식 상태
  const [faceRecognized, setFaceRecognized] = useState(false)
  const [recognizedAt, setRecognizedAt] = useState(null)
  const [isAbsentMarked, setIsAbsentMarked] = useState(false)

  // 팝업 상태
  const [showPopup, setShowPopup] = useState(false)
  const [popupText, setPopupText] = useState('')

  const studentId = 'S0000001' // TODO: 실제 값으로 교체

  const handleFaceRecognized = (name) => {
    if (!faceRecognized) {
      setFaceRecognized(true)
      setRecognizedAt(new Date())

      // 중앙 팝업 3초 표시
      setPopupText(`${name}님, 15분 내로 돌아오지 않으면 결석 처리됩니다!`)
      setShowPopup(true)

      setTimeout(() => {
        setShowPopup(false)
      }, 3000) // 3초
    }
  }

  // 15분 경과 시 결석 처리 (UI만)
  useEffect(() => {
    if (!faceRecognized || !recognizedAt || isAbsentMarked) return

    const timerId = setTimeout(() => {
      setIsAbsentMarked(true)
      console.log('15분 경과 → 결석 처리(UI)')
    }, 15 * 60 * 1000)

    return () => clearTimeout(timerId)
  }, [faceRecognized, recognizedAt, isAbsentMarked])

  const noticeText = !faceRecognized
    ? null
    : isAbsentMarked
    ? '15분이 경과하여 자동으로 결석 처리되었습니다.'
    : '얼굴 인식이 완료된 후 15분 내로 입실하지 않으면 결석 처리됩니다.'

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

          <Card>
            <CardHeader>
              <CardTitle>카메라 대기 화면</CardTitle>
              <CardBadge>
                {isAbsentMarked
                  ? '결석 처리'
                  : faceRecognized
                  ? '인식 완료'
                  : '대기중'}
              </CardBadge>
            </CardHeader>

            <CardText>
              기본 빈 화면입니다. 얼굴을 인식하면 안내 팝업이 뜹니다.
            </CardText>

            <CameraFrame>
              <FaceCamera onRecognized={handleFaceRecognized} />

              {/* 중앙 팝업 */}
              <PopupContainer className={showPopup ? 'show' : 'hide'}>
                {popupText}
              </PopupContainer>
            </CameraFrame>

            {noticeText && <FaceNotice>{noticeText}</FaceNotice>}
          </Card>
        </ContentInner>
      </ContentWrapper>
    </Wrapper>
  )
}

export default HomePage

/* styled-components */

/* 전체 배경 */
const Wrapper = styled.div`
  width: 100vw;
  min-height: 100vh;
  background-color: #dddddd99;
`

/* 상단바 */
const TitleBar = styled.div`
  display: flex;
  align-items: center;
  background-color: #3a051f;
  height: 80px;
  padding: 0 40px;
  position: sticky;
  top: 0;
  z-index: 10;

  @media (max-width: 768px) {
    height: 64px;
    padding: 0 16px;
  }
`

const LogoButton = styled.button`
  border: none;
  background: none;
  cursor: pointer;
  display: flex;
  align-items: center;
`

const NavArea = styled.nav`
  margin-left: 24px;
  display: flex;
  align-items: center;
  gap: 24px;

  @media (max-width: 768px) {
    margin-left: 16px;
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

  &:hover {
    background-color: #ffffff22;
  }

  @media (max-width: 768px) {
    font-size: 0.85rem;
    padding: 4px 10px;
  }
`

/* 과목 타이틀 줄 */
const SemiTitleBar = styled.div`
  display: flex;
  align-items: center;
  background-color: #b10058;
  height: 37px;
  padding-left: 50px;
  position: sticky;
  top: 80px;
  z-index: 9;

  @media (max-width: 768px) {
    height: 32px;
    padding-left: 16px;
    top: 64px;
  }
`

const TitleInner = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;

  @media (max-width: 768px) {
    gap: 16px;
  }
`

const SemiTitle = styled.h2`
  color: white;
  font-size: 1rem;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`

/* 메인 컨텐츠 래퍼 */
const ContentWrapper = styled.div`
  padding: 120px 0 40px;
  display: flex;
  justify-content: center;

  @media (max-width: 768px) {
    padding: 20px 0 24px;
  }
`

const ContentInner = styled.div`
  width: 960px;

  @media (max-width: 768px) {
    width: 100%;
    padding: 0 16px;
    box-sizing: border-box;
  }
`

const PageTitle = styled.h1`
  font-size: 26px;
  margin-bottom: 16px;

  @media (max-width: 768px) {
    font-size: 20px;
    margin-bottom: 12px;
  }
`

/* 카드 */
const Card = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 20px 20px 22px;
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 14px;

  @media (max-width: 768px) {
    padding: 16px 14px 18px;
    border-radius: 14px;
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

  @media (max-width: 768px) {
    font-size: 18px;
  }
`

const CardBadge = styled.span`
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.8rem;
  border: 1px solid #b10058;
  color: #b10058;

  @media (max-width: 768px) {
    font-size: 0.75rem;
    padding: 3px 8px;
  }
`

const CardText = styled.p`
  margin: 0;
  line-height: 1.6;
  color: #333;
  font-size: 0.95rem;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`

/* 카메라 영역 */
const CameraFrame = styled.div`
  margin-top: 10px;
  width: 100%;
  aspect-ratio: 16 / 9;
  background: #000;
  border-radius: 12px;
  overflow: hidden;
  position: relative;

  @media (max-width: 768px) {
    aspect-ratio: 3 / 4; /* 모바일에서 세로로 좀 더 길게 */
  }
`

/* 중앙 팝업 (fade-in/out) */
const PopupContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.95);
  color: #b10058;
  padding: 14px 22px;
  font-size: 0.95rem;
  font-weight: 700;
  border-radius: 16px;
  z-index: 20;
  opacity: 0;
  transition: opacity 0.6s ease;

  &.show {
    opacity: 1;
  }

  &.hide {
    opacity: 0;
  }

  @media (max-width: 768px) {
    font-size: 0.85rem;
    padding: 10px 16px;
    text-align: center;
  }
`

/* 아래 안내 배너 */
const FaceNotice = styled.div`
  margin-top: 16px;
  padding: 16px 22px;
  border-radius: 999px;
  border: 1px solid #f5a3c4;
  background-color: #fff6f9;
  color: #222;
  font-size: 0.95rem;
  line-height: 1.6;

  @media (max-width: 768px) {
    padding: 12px 16px;
    font-size: 0.9rem;
  }
`
