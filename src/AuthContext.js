import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  // 로그인 상태 복원
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    if (token && storedUsername) {
      validateToken()
        .then(() => {
          setIsLoggedIn(true);
          setUsername(storedUsername);
        })
        .catch(() => handleLogout());
    }
  }, []);

  // 토큰 검증
  const validateToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return Promise.reject('No token found');
    return axios.post('http://localhost:8080/api/verify-token', { token });
  };

  // 로그인 처리
  const handleLogin = (user) => {
    localStorage.setItem('token', user.token);
    localStorage.setItem('username', user.username);
    setIsLoggedIn(true);
    setUsername(user.username);
  };

  // 로그아웃 처리
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    setUsername('');
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        username,
        handleLogin,
        handleLogout,
        validateToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
