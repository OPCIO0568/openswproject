import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Axios로 API 호출

import './LoginPage.css';

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // 로그인 API 호출
      const response = await axios.post('http://localhost:8080/auth/login', {
        username,
        password,
      });

      // 성공 시 토큰 저장 및 부모 컴포넌트로 전달
      const { token, message } = response.data;
      localStorage.setItem('token', token); // 토큰 로컬 스토리지에 저장
      onLogin({ username, message }); // 부모 컴포넌트로 전달
      navigate('/'); // 메인 페이지로 이동
    } catch (error) {
      // 실패 시 에러 메시지 처리
      if (error.response && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="loginBox">
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <div className="formGroup">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="formGroup">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">로그인</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p>
        계정이 없으신가요?{' '}
        <Link to="/signup" style={{ color: '#4CAF50', textDecoration: 'none' }}>
          회원가입
        </Link>
      </p>
    </div>
  );
}

export default LoginPage;
