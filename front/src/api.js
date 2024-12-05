import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080/api', // Spring Boot API URL
  timeout: 5000, // 요청 타임아웃 설정 (5초)
});

// 요청 인터셉터
API.interceptors.request.use(config => {
  // 인증 토큰 추가
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

    // 토큰이 유효하지 않은 경우 처리
    if (error.response && error.response.status === 401) {
      // 로컬 스토리지에서 토큰 제거
      localStorage.removeItem('token');

      // 로그아웃 시키고 로그인 페이지로 리디렉션
      window.location.href = '/login?timeout=true';

      // 로그인 타임아웃 알림
      alert('로그인 시간이 만료되었습니다. 다시 로그인해 주세요.');
    }

    return Promise.reject(error);
  }
);

export default API;
