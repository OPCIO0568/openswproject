import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080/api', // Spring Boot API URL
  timeout: 5000, // 요청 타임아웃 설정 (5초)
});

// 요청 인터셉터
API.interceptors.request.use(config => {
  // 예: 인증 토큰 추가
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답 인터셉터
API.interceptors.response.use(
  response => response,
  error => {
    console.error('응답 오류:', error.response);
    return Promise.reject(error);
  }
);

export default API;
