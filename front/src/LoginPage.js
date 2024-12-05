import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './AuthContext';

function LoginPage() {
  const { handleLogin, handleLogout } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // 로그인 페이지에 진입할 때 로그아웃 수행
  useEffect(() => {
    const logoutAndClear = async () => {
      await handleLogout();
    };
    logoutAndClear();
  }, [handleLogout]);

  // 로그인 타임아웃 메시지 표시를 위한 쿼리 파라미터 확인
  const params = new URLSearchParams(location.search);
  const isTimeout = params.get('timeout') === 'true';

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:8080/auth/login',
        { username, password },
        { withCredentials: true }
      );

      const { token, message } = response.data;
      if (message === 'Login successful') {
        handleLogin({ username, token });
        navigate('/');
      } else {
        setError('Unexpected server response');
      }
    } catch (error) {
      setError(error.response?.data?.error || 'An unexpected error occurred.');
    }
  };

  return (
    <div className="loginBox">
      <h1>Login</h1>
      {/* 로그인 타임아웃 메시지 표시 */}
      {isTimeout && (
        <p style={{ color: 'red' }}>
          로그인 시간이 만료되었습니다. 다시 로그인해 주세요.
        </p>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleLoginSubmit}>
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
