import React, { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from './AuthContext'; // AuthContext 사용

function PrivateRoute({ children }) {
  const { isLoggedIn, validateToken } = useContext(AuthContext); // 인증 상태 및 토큰 검증 함수
  const [isTokenValid, setIsTokenValid] = useState(null); // 토큰 유효성 여부

  useEffect(() => {
    if (isLoggedIn) {
      validateToken()
        .then(() => setIsTokenValid(true)) // 유효하면 true
        .catch(() => setIsTokenValid(false)); // 유효하지 않으면 false
    } else {
      setIsTokenValid(false);
    }
  }, [isLoggedIn, validateToken]);

  if (isTokenValid === null) return <div>Loading...</div>; // 검증 중 로딩 표시
  return isTokenValid ? children : <Navigate to="/login" />;
}

export default PrivateRoute;
