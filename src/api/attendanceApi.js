// src/api/attendanceApi.js
import axiosClient from './axiosClient'

/**
 * 특정 주차 출석 기록 조회
 * GET /api/attendance?week={week}
 */
export async function fetchAttendanceByWeek(week) {
  const response = await axiosClient.get('/api/attendance', {
    params: { week },
  })
  return response.data
}

// week, status = '출석', student_id
export async function fetchAttendanceCheck(studentId, week = 1) {
  const response = await axiosClient.post('api/attendance/check', {

      week, // 기본값 1
      status: '출석', // 고정
      student_id: studentId, // 페이지에서 넘겨줌

  })
  return response.data
}


/**
 * 얼굴 인식 후 15분 지나면 결석 처리
 * POST /api/attendance/absent
 * body: { studentId }
 */
export async function markAbsent(studentId) {
  const response = await axiosClient.post('/api/attendance/absent', {
    studentId,
  })
  return response.data
}