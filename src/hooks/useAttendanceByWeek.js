// src/hooks/useAttendanceByWeek.js
import { useEffect, useState } from 'react'
import { fetchAttendanceByWeek } from '../api/attendanceApi'

// week를 안 넘기면 기본값 1주차
export function useAttendanceByWeek(week = 1) {
  const [attendanceList, setAttendanceList] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!week) return

    setLoading(true)
    setError(null)

    fetchAttendanceByWeek(week)
      .then((data) => {
        // 👉 백엔드 응답 형식:
        // {
        //   data: [...],
        //   success: true,
        //   summary: {...},
        //   timestamp: "...",
        //   week: 1
        // }
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
          ? data.data
          : []

        setAttendanceList(list)
      })
      .catch((err) => {
        console.error(err)
        setError('출석 정보를 불러오는데 실패했습니다.')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [week])

  return { attendanceList, loading, error }
}
