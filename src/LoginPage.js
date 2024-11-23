import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import './LoginPage.css';

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // 로그인 로직 예제
    if (email === 'user@example.com' && password === 'password') {
      // 성공 시 부모로 로그인 데이터 전달
      onLogin({ username: 'User123' }); // 예제 닉네임
      navigate('/');
    } else {
      // 실패 시 에러 표시
      setError('Invalid email or password');
    }
  };

  return (
    <div className="loginBox">
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <div className="formGroup">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
