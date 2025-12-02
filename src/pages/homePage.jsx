// src/pages/HomePage.jsx
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Logo from '../components/Logo.jsx'
import FaceCamera from '../components/FaceCamera.jsx'
import { useAttendanceByWeek } from '../hooks/useAttendanceByWeek.js'
import { fetchAttendanceCheck } from '../api/attendanceApi.js' // ✅ 여기 추가

// ✅ 코드 → 실제 이름 매핑
const FACE_NAME_MAP = {
  bae: '배혜윤',
  cho: '김초련',
  yun: '송윤서',
  jumi: '송주미',
}

function HomePage() {
  const navigate = useNavigate()

  // 1주차 출석 데이터 (리스트)
  const { attendanceList, loading: attendanceLoading } = useAttendanceByWeek(1)

  // 얼굴 인식 여부 (이 화면에서 한 번이라도 인식됐는지)
  const [faceRecognized, setFaceRecognized] = useState(false)

  // API 전송 상태
  const [isSending, setIsSending] = useState(false)
  const [lastResult, setLastResult] = useState(null)
  // lastResult: { status: 'success' | 'error', message: string } | null

  // 팝업 상태
  const [showPopup, setShowPopup] = useState(false)
  const [popupText, setPopupText] = useState('')

  // ✅ 얼굴 인식 시마다 API 호출
  const handleFaceRecognized = async (code) => {
    // code: 'bae', 'cho', 'yun', 'jumi' 같은 값이라고 가정
    const koreanName = FACE_NAME_MAP[code] || code // 매핑 없으면 그대로 사용

    // 이 화면에서 얼굴 인식된 적이 있다는 표시
    setFaceRecognized(true)

    // 팝업 바로 표시
    setPopupText(`${koreanName}님 얼굴이 인식되었습니다. 출석 요청 중...`)
    setShowPopup(true)

    // 출석 리스트 아직 로딩 중이면 차단
    if (attendanceLoading) {
      const msg = '출석 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요.'
      setLastResult({
        status: 'error',
        message: msg,
      })
      setPopupText(msg)
      setTimeout(() => setShowPopup(false), 3000)
      return
    }

    setIsSending(true)

    try {
      // ✅ 1주차 출석 리스트에서 해당 이름 찾기
      const matched = attendanceList.find(
        (item) => item.name === koreanName
      )

      if (!matched) {
        throw new Error(`${koreanName}님의 출석 대상 정보를 찾을 수 없습니다.`)
      }

      const studentId = matched.student_id // 👉 여기서 student_id 뽑음

      // 🔥 헬퍼 함수 사용해서 POST 요청
      // week은 기본값 1 사용 (원하면 fetchAttendanceCheck(studentId, 1)로 명시도 가능)
      const data = await fetchAttendanceCheck(studentId)

      const message =
        data?.message || `${koreanName}님 출석이 정상적으로 처리되었습니다.`

      setLastResult({
        status: 'success',
        message,
      })

      // ✅ 성공 팝업 문구
      setPopupText(message)

      // ✅ 콘솔에도 찍기 (브라우저 DevTools 콘솔에서 확인)
      console.log('[HomePage] 출석 API 성공:', {
        apiResponse: data,
        matchedStudent: matched,
      })
    } catch (error) {
      console.error('[HomePage] 출석 API 실패:', error)

      const errorMsg =
        error?.response?.data?.message ||
        error?.message ||
        '출석 처리 중 알 수 없는 오류가 발생했습니다. 다시 시도해주세요.'

      setLastResult({
        status: 'error',
        message: errorMsg,
      })

      setPopupText(errorMsg)
    } finally {
      setIsSending(false)

      // 팝업은 3초 후에 사라지게
      setTimeout(() => {
        setShowPopup(false)
      }, 3000)
    }
  }

  // 안내 문구
  const noticeText = !faceRecognized
    ? '카메라 앞에 서서 얼굴을 인식하면 자동으로 출석이 서버로 전송됩니다.'
    : lastResult?.status === 'success'
    ? lastResult.message
    : lastResult?.status === 'error'
    ? lastResult.message
    : '얼굴이 인식되었습니다. 출석 요청을 처리 중입니다.'

  // 카드 상단 상태 뱃지 텍스트
  const badgeText = isSending
    ? '전송 중'
    : lastResult?.status === 'success'
    ? '전송 완료'
    : lastResult?.status === 'error'
    ? '오류'
    : faceRecognized
    ? '인식됨'
    : '대기중'

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
              <CardBadge>{badgeText}</CardBadge>
            </CardHeader>

            <CardText>
              기본 빈 화면입니다. 얼굴을 인식하면 출석 요청이 서버로 전송됩니다.
            </CardText>

            <CameraFrame>
              {/* FaceCamera에서 onRecognized(code) 호출해 주는 구조라고 가정 (bae, cho ...) */}
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
