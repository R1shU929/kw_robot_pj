import { useState } from "react";
import Logo from "./components/Logo";
import styled from "styled-components";

function MainPage() {
  const [selectedWeek, setSelectedWeek] = useState(1);
  const weeks = [1, 2, 3, 4, 5, 6, 7];

  return (
    <Wrapper>
      {/* 맨 위 학교 로고 바 */}
      <TitleBar>
        <Logo />
      </TitleBar>
      <SemiTitleBar>
        <SemiTitle>
        로봇학입문 (I000-1-6241-01) - 박수한
        </SemiTitle>
      </SemiTitleBar>

      {/* 이 부분이 전체 콘텐츠 영역 */}
      <ContentWrapper>
        {/* 공통 페이지 제목: 양쪽 위에 딱 하나만 */}
        <PageTitle>{selectedWeek}주차 출석부</PageTitle>

        {/* 왼쪽 박스 + 오른쪽 테이블 나란히 */}
        <ContextArea>
          {/* --- 왼쪽 주차별 학습현황 --- */}
          <WeeksBox>
            <WeekTitle>주차별 학습현황</WeekTitle>
            {weeks.map((week) => (
              <WeekItem
                key={week}
                $active={selectedWeek === week}
                onClick={() => setSelectedWeek(week)}
              >
                <span>{week}주차</span>
                <span>➜</span>
              </WeekItem>
            ))}
          </WeeksBox>

          {/* --- 오른쪽 테이블 --- */}
          <Table>
            <thead>
              <tr>
                <Th>번호</Th>
                <Th>이름</Th>
                <Th>학번</Th>
                <Th>학과</Th>
                <Th>출석</Th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 7 }).map((_, idx) => (
                <tr key={idx}>
                  <Td></Td>
                  <Td></Td>
                  <Td></Td>
                  <Td></Td>
                  <Td></Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </ContextArea>
      </ContentWrapper>
    </Wrapper>
  );
}

export default MainPage;

const Wrapper = styled.div`
  width: 100vw;
  min-height: 100vh;
  background-color: #dddddd99;
`;

const TitleBar = styled.div`
  display: flex;
  background-color: #3A051F;
  height: 80px;
  position: sticky;
  top: 0;
`;

const SemiTitleBar = styled.div`
  display: flex;
  background-color: #b10058;
  height: 37px;
  position: sticky;
  top: 0;
`;

const SemiTitle = styled.h2`
font-weight: 500;
font-size: 1rem;
color:white;
padding-left: 50px;
padding-top: 10px;
`;

const ContentWrapper = styled.div`
  padding-top: 100px; /* 위/아래 여백 조절 */
`;

const PageTitle = styled.h2`
  margin: 0 auto 24px;
  width: 960px;          
  font-size: 24px;
`;

const ContextArea = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;  
  gap: 45px;
`;

/* 왼쪽 박스 */
const WeeksBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 220px;
  border: 1px solid #ccc;
`;

const WeekTitle = styled.div`
  padding: 18px;
  font-size: 20px;
  font-weight: bold;
  border-bottom: 1px solid #ccc;
  background: #f5f5f5;
`;

const WeekItem = styled.div`
  padding: 18px;
  font-size: 20px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #ccc;
  cursor: pointer;
  background-color: ${({ $active }) => ($active ? "#bababa" : "#fff")};

  &:hover {
    background-color: #bababa;
  }
`;

/* 오른쪽 테이블 */
const Table = styled.table`
  width: 700px;
  border-collapse: collapse;
  background: #f5f5f5;
  font-size: 20px;
`;

const Th = styled.th`
  border: 1px solid #ccc;
  padding: 16px;
  background: #fefefe;
`;

const Td = styled.td`
  border: 1px solid #ccc;
  height: 60px;
  background: #f7f7f7;
`;

