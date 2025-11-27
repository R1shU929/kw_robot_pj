// src/components/AttendanceTable.js
import styled from 'styled-components'

function AttendanceTable({ attendanceList, loading, error }) {
	if (loading) {
		return (
			<TableWrapper>
				<p>불러오는 중...</p>
			</TableWrapper>
		)
	}

	if (error) {
		return (
			<TableWrapper>
				<p>{error}</p>
			</TableWrapper>
		)
	}

	if (!attendanceList || attendanceList.length === 0) {
		return (
			<TableWrapper>
				<p>출석 데이터가 없습니다.</p>
			</TableWrapper>
		)
	}

	return (
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
				{attendanceList.map((item, index) => (
					<tr key={item.id || index}>
						<Td>{item.number}</Td>
						<Td>{item.name}</Td>
						<Td>{item.student_id}</Td>
						<Td>{item.department}</Td>
						<Td>{item.is_attendance ? '출석' : '결석'}</Td>
					</tr>
				))}
			</tbody>
		</Table>
	)
}

export default AttendanceTable

/* styled-components */

const TableWrapper = styled.div`
	width: 700px;
	min-height: 200px;
	background: #f5f5f5;
	display: flex;
	justify-content: center;
	align-items: center;
`

const Table = styled.table`
	width: 700px;
	border-collapse: collapse;
	background: #f5f5f5;
	font-size: 20px;
`

const Th = styled.th`
	border: 1px solid #ccc;
	padding: 16px;
	text-align: center;
  vertical-align: middle;
	background: #fefefe;
`

const Td = styled.td`
	border: 1px solid #ccc;
	height: 60px;
	text-align: center;
  vertical-align: middle;
	background: #f7f7f7;
`
