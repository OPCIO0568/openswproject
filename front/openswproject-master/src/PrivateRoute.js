import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from './AuthContext';

function PrivateRoute({ children }) {
  const { username } = useContext(AuthContext);

  if (!username) {
    alert('로그인이 필요합니다'); // 알림 표시
    return <Navigate to="/login" />; // 로그인 페이지로 리다이렉트
  }

  return children; // 로그인된 사용자는 접근 가능
}

export default PrivateRoute;
