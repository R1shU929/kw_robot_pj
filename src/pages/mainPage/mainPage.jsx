// src/pages/mainPage/mainPage.jsx
import { useState } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'

import { useAttendanceByWeek } from '../../hooks/useAttendanceByWeek'
import Logo from '../../components/Logo.jsx'
import WeekSidebar from '../../components/WeekSidebar.jsx'
import AttendanceTable from '../../components/AttendanceTable.jsx'

function MainPage() {
  const [selectedWeek, setSelectedWeek] = useState(1)
  const weeks = [1, 2, 3, 4, 5, 6, 7]

  const { attendanceList, loading, error } = useAttendanceByWeek(selectedWeek)
  const navigate = useNavigate()

  return (
    <Wrapper>
      {/* 상단바 */}
      <TitleBar>
        <TitleInner>
          <LogoButton onClick={() => navigate('/')}>
            <Logo />
          </LogoButton>

          {/* 로고 바로 옆 출석부 버튼 */}
          <NavItem onClick={() => navigate('/attendance')}>출석부</NavItem>
        </TitleInner>
      </TitleBar>

      <SemiTitleBar>
        <SemiTitle>로봇학입문 (I000-1-6241-01) - 박수한</SemiTitle>
      </SemiTitleBar>
      <ContentWrapper>
        <ContentInner>
          <PageTitle>{selectedWeek}주차 출석부</PageTitle>

          <ContextArea>
            {/* 모바일에서는 위, PC에서는 왼쪽 */}
            <SidebarWrapper>
              <WeekSidebar
                weeks={weeks}
                selectedWeek={selectedWeek}
                onSelectWeek={setSelectedWeek}
              />
            </SidebarWrapper>

            {/* 모바일/PC 공통 테이블 */}
            <TableWrapper>
              <AttendanceTable
                attendanceList={attendanceList}
                loading={loading}
                error={error}
              />
            </TableWrapper>
          </ContextArea>
        </ContentInner>
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

/* 로고 + 출석부 버튼 묶음 */
const TitleInner = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;

  @media (max-width: 480px) {
    gap: 16px;
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
  padding: 0 50px; /* 로고랑 x위치 맞춤 */

  @media (max-width: 480px) {
    top: 64px;
    height: 32px;
    padding: 0 16px;
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

const PageTitle = styled.h2`
  font-size: 24px;
  margin: 0 0 24px;

  @media (max-width: 480px) {
    font-size: 20px;
    margin-bottom: 12px;
  }
`

const ContextArea = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 32px;

  @media (max-width: 480px) {
    flex-direction: column; /* 폰에서는 위아래로 */
    gap: 16px;
  }
`

const SidebarWrapper = styled.div`
  @media (max-width: 480px) {
    width: 100%;
  }
`

const TableWrapper = styled.div`
  flex: 1;
  min-width: 0;

  @media (max-width: 480px) {
    width: 100%;
  }
`
