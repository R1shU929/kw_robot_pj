// src/pages/HomePage.jsx
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Logo from '../components/Logo.jsx'
import FaceCamera from '../components/FaceCamera.jsx'
import { useAttendanceByWeek } from '../hooks/useAttendanceByWeek.js'
import { fetchAttendanceCheck } from '../api/attendanceApi.js'

// 얼굴 코드 → 실제 한국어 이름 매핑
const FACE_NAME_MAP = {
	bae: '배혜윤',
	cho: '김초련',
	yun: '송윤서',
	jumi: '송주미',
}

function HomePage() {
	const navigate = useNavigate()

	const { attendanceList, loading: attendanceLoading } = useAttendanceByWeek(1)

	// 인식 횟수
	const [recognitionCount, setRecognitionCount] = useState(0)

	// API 중복 호출 방지 LOCK
	const [attendanceSent, setAttendanceSent] = useState(false)

	// UI 상태
	const [showPopup, setShowPopup] = useState(false)
	const [popupText, setPopupText] = useState('')

	const handleFaceRecognized = async code => {
		const koreanName = FACE_NAME_MAP[code] || code

		// 인식 횟수 증가
		setRecognitionCount(prev => prev + 1)
		const newCount = recognitionCount + 1

		// ✅ 4번째 인식부터는 아무 처리도 하지 않음 (API + 팝업 전부 X)
		if (newCount >= 4) {
			console.log('🎥 4번째 이상 인식 - 추가 처리 없음', {
				code,
				koreanName,
				newCount,
			})
			return
		}

		console.log('🎥 얼굴 인식됨:', { code, koreanName, newCount })

		// ============================================================
		// ⭐ 첫 인식 → 단 한 번만 출석 API 호출
		// ============================================================
		if (!attendanceSent) {
			setAttendanceSent(true) // 🔒 즉시 LOCK, API 중복 호출 절대 불가

			setPopupText(`${koreanName}님 얼굴이 인식되었습니다. 출석 요청 중...`)
			setShowPopup(true)

			if (attendanceLoading) {
				setPopupText(
					'출석 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요.',
				)
				return
			}

			try {
				const student = attendanceList.find(s => s.name === koreanName)

				if (!student) {
					throw new Error(`${koreanName}님의 출석 정보를 찾을 수 없습니다.`)
				}

				await fetchAttendanceCheck(student.student_id)

				setPopupText('출석이 체크되었습니다.')
				setShowPopup(true)
			} catch (err) {
				console.error('출석 API 실패:', err)
				setPopupText('출석 처리 중 오류가 발생했습니다.')
				setShowPopup(true)
			}

			return // 🔥 첫 인식 처리 완료 후 즉시 종료
		}

		// ============================================================
		// ⭐ 두 번째 인식
		// ============================================================
		if (newCount === 2) {
			setPopupText('15분 내 복귀하지 않으면 결석 처리됩니다.')
			setShowPopup(true)
			return
		}

		// ============================================================
		// ⭐ 세 번째 인식
		// ============================================================
		if (newCount === 3) {
			setPopupText('출석이 유지됩니다. 자리로 돌아가세요.')
			setShowPopup(true)
			return
		}
	}

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
						</CardHeader>

						<CameraFrame>
							<FaceCamera onRecognized={handleFaceRecognized} />

							<PopupContainer className={showPopup ? 'show' : 'hide'}>
								{popupText}
							</PopupContainer>
						</CameraFrame>
					</Card>
				</ContentInner>
			</ContentWrapper>
		</Wrapper>
	)
}

export default HomePage

/* styled-components 아래는 그대로 유지 */

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
