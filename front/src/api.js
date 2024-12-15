import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080/api', // Spring Boot API URL
  timeout: 10000, // 요청 타임아웃 설정 (10초)
});

// 요청 인터셉터
API.interceptors.request.use(config => {
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
    console.error('응답 오류:', error.response || error.message);

    if (error.response) {
      switch (error.response.status) {
        case 401: // 인증 실패
          localStorage.removeItem('token');
          window.location.href = '/login?timeout=true';
          alert('로그인 시간이 만료되었습니다. 다시 로그인해 주세요.');
          break;
        case 403: // 접근 금지
          alert('접근이 거부되었습니다.');
          break;
        case 500: // 서버 오류
          alert('서버 오류가 발생했습니다.');
          break;
        default:
          alert('오류가 발생했습니다.');
      }
    }

    return Promise.reject(error);
  }
);

export default API;
