// src/api/attendanceApi.js
import axiosClient from './axiosClient'

/**
 * 특정 주차 출석 기록 조회
 * GET /api/attendance?week={week}
 */

// https://attendance-system-chi-ten.vercel.app//api/attendance
export async function fetchAttendanceByWeek(week) {
	const response = await axiosClient.get('/api/attendance', {
		params: { week },
	})

	// 백엔드 응답 형식에 맞게 조정 필요
	// 예: { data: [...]} 형태라면 response.data.data 로 변경
	return response.data
}
