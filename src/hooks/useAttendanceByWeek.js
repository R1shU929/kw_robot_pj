// src/hooks/useAttendanceByWeek.js
import { useEffect, useState } from 'react'
import { fetchAttendanceByWeek } from '../api/attendanceApi'

export function useAttendanceByWeek(week) {
	const [attendanceList, setAttendanceList] = useState([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)

	useEffect(() => {
		if (!week) return

		setLoading(true)
		setError(null)

		fetchAttendanceByWeek(week)
			.then(data => {
				// data가 배열이라고 가정 (백엔드 응답 형식에 맞게 수정)
				setAttendanceList(Array.isArray(data) ? data : data?.data || [])
			})
			.catch(err => {
				console.error(err)
				setError('출석 정보를 불러오는데 실패했습니다.')
			})
			.finally(() => {
				setLoading(false)
			})
	}, [week])

	return { attendanceList, loading, error }
}
