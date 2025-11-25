// src/api/axiosClient.js
import axios from 'axios'

const axiosClient = axios.create({
	baseURL: import.meta.env.VITE__API_BASE_URL,
	withCredentials: false, // 필요하면 true로 변경
})

// 필요 시 인터셉터도 여기서 설정 가능
// axiosClient.interceptors.request.use((config) => {
//   // 토큰 붙이고 싶으면 여기서
//   return config;
// });

export default axiosClient
