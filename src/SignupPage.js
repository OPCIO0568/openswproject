// src/SignupPage.js
import React, { useState } from 'react';
import './LoginPage.css'; // 기존 로그인 스타일 재활용
import axios from 'axios'; // Axios를 사용한 API 호출

function SignupPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nickname, setNickname] = useState(''); // 닉네임 추가
  const [message, setMessage] = useState(''); // 성공/실패 메시지 저장

  const handleSignup = async (e) => {
    e.preventDefault();

    // 비밀번호 확인
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    // API 요청
    try {
      const response = await axios.post('http://localhost:8080/auth/register', {
        username,
        password,
        nickname, // nickname 필드 추가
      });

      if (response.data.message) {
        setMessage(response.data.message); // 성공 메시지 표시
        setUsername('');
        setPassword('');
        setConfirmPassword('');
        setNickname('');
      }
    } catch (error) {
      // 실패 메시지 처리
      if (error.response && error.response.data.error) {
        setMessage(error.response.data.error);
      } else {
        setMessage('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="loginBox">
      <h1>Sign Up</h1>
      <form onSubmit={handleSignup}>
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
        <div className="formGroup">
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <div className="formGroup">
          <label htmlFor="nickname">Nickname:</label>
          <input
            type="text"
            id="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            required
          />
        </div>
        <button type="submit">회원가입</button>
      </form>
      {message && <p className="message">{message}</p>} {/* 메시지 출력 */}
    </div>
  );
}

export default SignupPage;
