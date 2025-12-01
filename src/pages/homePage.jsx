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

  // TODO: 실제 studentId로 변경
  const studentId = 'S0000001'

  // 얼굴 인식 시 실행
  const handleFaceRecognized = (name) => {
    if (!faceRecognized) {
      setFaceRecognized(true)
      setRecognizedAt(new Date())

      // 팝업 표시
      setPopupText(`${name}님, 15분 내로 돌아오지 않으면 결석 처리됩니다!`)
      setShowPopup(true)

      // 팝업 5초 후 fade-out
      setTimeout(() => {
        setShowPopup(false)
      }, 4000)
    }
  }

  // 15분 뒤 결석 처리 (프론트 UI만)
  useEffect(() => {
    if (!faceRecognized || !recognizedAt || isAbsentMarked) return

    const timerId = setTimeout(() => {
      setIsAbsentMarked(true)
      console.log('15분 경과 → 결석 처리됨(프론트)')
    }, 15 * 60 * 1000)

    return () => clearTimeout(timerId)
  }, [faceRecognized, recognizedAt, isAbsentMarked])

  // 안내문 텍스트
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

            {/* 카메라 + 팝업 */}
            <CameraFrame>
              <FaceCamera onRecognized={handleFaceRecognized} />

              {/* 중앙 팝업 */}
              <PopupContainer className={showPopup ? 'show' : 'hide'}>
                {popupText}
              </PopupContainer>
            </CameraFrame>

            {/* 안내 문구 (카드 내부에 고정) */}
            {noticeText && <FaceNotice>{noticeText}</FaceNotice>}
          </Card>
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
  align-items: center;
  background-color: #3a051f;
  height: 80px;
  padding: 0 40px;
  position: sticky;
  top: 0;
  z-index: 10;
`

const LogoButton = styled.button`
  border: none;
  background: none;
  cursor: pointer;
  display: flex;
  align-items: center;
`

const NavArea = styled.nav`
  margin-left: 20px;
  display: flex;
  align-items: center;
  gap: 24px;
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
`

const SemiTitleBar = styled.div`
  display: flex;
  align-items: center;
  background-color: #b10058;
  height: 37px;
  padding-left: 20px;
  position: sticky;
  top: 80px;
  z-index: 9;
`

const TitleInner = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
`

const SemiTitle = styled.h2`
  color: white;
  font-size: 1rem;
`

const ContentWrapper = styled.div`
  padding: 40px 0 40px;
  display: flex;
  justify-content: center;
`

const ContentInner = styled.div`
  width: 960px;
`

const PageTitle = styled.h1`
  font-size: 26px;
  margin-bottom: 16px;
`

const Card = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 20px 20px 22px;
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 14px;
`

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const CardTitle = styled.h2`
  font-size: 20px;
  margin: 0;
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
`

const CameraFrame = styled.div`
  margin-top: 10px;
  width: 100%;
  aspect-ratio: 16 / 9;
  background: #000;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
`

/* ⭐ 중앙 팝업 + fade-out */
const PopupContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.95);
  color: #b10058;
  padding: 14px 22px;
  font-size: 1rem;
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
`

const FaceNotice = styled.div`
  margin-top: 16px;
  padding: 16px 22px;
  border-radius: 999px;
  border: 1px solid #f5a3c4;
  background-color: #fff6f9;
  color: #222;
  line-height: 1.6;
`
