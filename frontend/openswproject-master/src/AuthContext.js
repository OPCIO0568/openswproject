import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    if (token && storedUsername) {
      validateToken(token)
        .then(() => {
          setIsLoggedIn(true);
          setUsername(storedUsername);
        })
        .catch(() => handleLogout())
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const validateToken = async (token) => {
    try {
      await axios.post('http://localhost:8080/api/verify-token', { token });
      return true;
    } catch (error) {
      console.error('토큰 검증 실패:', error);
      return false;
    }
  };

  const handleLogin = (user) => {
    localStorage.setItem('token', user.token);
    localStorage.setItem('username', user.username);
    setIsLoggedIn(true);
    setUsername(user.username);
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:8080/api/logout');
    } catch (error) {
      console.warn('로그아웃 실패 (무시 가능):', error);
    }
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
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// useAuth 훅 정의 및 내보내기
export const useAuth = () => useContext(AuthContext);

export default AuthContext;
