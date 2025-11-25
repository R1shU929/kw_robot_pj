// src/components/WeekSidebar.js
import styled from 'styled-components'

function WeekSidebar({ weeks, selectedWeek, onSelectWeek }) {
	return (
		<WeeksBox>
			<WeekTitle>주차별 학습현황</WeekTitle>
			{weeks.map(week => (
				<WeekItem
					key={week}
					$active={selectedWeek === week}
					onClick={() => onSelectWeek(week)}
				>
					<span>{week}주차</span>
					<span>➜</span>
				</WeekItem>
			))}
		</WeeksBox>
	)
}

export default WeekSidebar

/* styled-components */

const WeeksBox = styled.div`
	display: flex;
	flex-direction: column;
	width: 220px;
	border: 1px solid #ccc;
`

const WeekTitle = styled.div`
	padding: 18px;
	font-size: 20px;
	font-weight: bold;
	border-bottom: 1px solid #ccc;
	background: #f5f5f5;
`

const WeekItem = styled.div`
	padding: 18px;
	font-size: 20px;
	display: flex;
	justify-content: space-between;
	border-bottom: 1px solid #ccc;
	cursor: pointer;
	background-color: ${({ $active }) => ($active ? '#bababa' : '#fff')};

	&:hover {
		background-color: #bababa;
	}
`
