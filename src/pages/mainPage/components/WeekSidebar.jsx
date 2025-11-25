// WeekSidebar.jsx
import styled from "styled-components";

const weeks = [1, 2, 3, 4, 5, 6, 7];

function WeekSidebar({ selectedWeek, onSelectWeek }) {
  return (
    <Wrapper>
      <Header>주차별 학습현황</Header>
      {weeks.map((week) => (
        <WeekRow
          key={week}
          isActive={selectedWeek === week}
          onClick={() => onSelectWeek(week)}
        >
          {week}주차 ➤
        </WeekRow>
      ))}
    </Wrapper>
  );
}

export default WeekSidebar;

const Wrapper = styled.div`
  width: 220px;
  border: 1px solid #ddd;
`;

const Header = styled.div`
  padding: 16px;
  font-weight: 700;
  background: #f3f3f3;
  border-bottom: 1px solid #ddd;
`;

const WeekRow = styled.div`
  padding: 16px;
  cursor: pointer;
  border-bottom: 1px solid #ddd;
  background: ${({ isActive }) => (isActive ? "#f5f5f5" : "white")};

  &:hover {
    background: #f0f0f0;
  }
`;
