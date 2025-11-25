// src/pages/MainPage.js
import { useState } from 'react'
import styled from 'styled-components'

import { useAttendanceByWeek } from '../../hooks/useAttendanceByWeek'
import Logo from '../../components/Logo'
import WeekSidebar from '../../components/WeekSidebar'
import AttendanceTable from '../../components/AttendanceTable'

function MainPage() {
	const [selectedWeek, setSelectedWeek] = useState(1)
	const weeks = [1, 2, 3, 4, 5, 6, 7]

	const { attendanceList, loading, error } = useAttendanceByWeek(selectedWeek)

	return (
		<Wrapper>
			{/* 맨 위 학교 로고 바 */}
			<TitleBar>
				<Logo />
			</TitleBar>
			<SemiTitleBar>
				<SemiTitle>로봇학입문 (I000-1-6241-01) - 박수한</SemiTitle>
			</SemiTitleBar>

			{/* 이 부분이 전체 콘텐츠 영역 */}
			<ContentWrapper>
				{/* 공통 페이지 제목: 양쪽 위에 딱 하나만 */}
				<PageTitle>{selectedWeek}주차 출석부</PageTitle>

				{/* 왼쪽 박스 + 오른쪽 테이블 나란히 */}
				<ContextArea>
					{/* --- 왼쪽 주차별 학습현황 --- */}
					<WeekSidebar
						weeks={weeks}
						selectedWeek={selectedWeek}
						onSelectWeek={setSelectedWeek}
					/>

					{/* --- 오른쪽 테이블 --- */}
					<AttendanceTable
						attendanceList={attendanceList}
						loading={loading}
						error={error}
					/>
				</ContextArea>
			</ContentWrapper>
		</Wrapper>
	)
}

export default MainPage

/* styled-components */

const Wrapper = styled.div`
	width: 100vw;
	min-height: 100vh;
	background-color: #dddddd99;
`

const TitleBar = styled.div`
	display: flex;
	background-color: #3a051f;
	height: 80px;
	position: sticky;
	top: 0;
	z-index: 10;
`

const SemiTitleBar = styled.div`
	display: flex;
	background-color: #b10058;
	height: 37px;
	position: sticky;
	top: 80px; /* 위에 로고바 밑에 붙도록 */
	z-index: 9;
`

const SemiTitle = styled.h2`
	font-weight: 500;
	font-size: 1rem;
	color: white;
	padding-left: 50px;
	padding-top: 10px;
`

const ContentWrapper = styled.div`
	padding-top: 120px; /* 위/아래 여백 조절 */
`

const PageTitle = styled.h2`
	margin: 0 auto 24px;
	width: 960px;
	font-size: 24px;
`

const ContextArea = styled.div`
	display: flex;
	justify-content: center;
	align-items: flex-start;
	gap: 45px;
`
