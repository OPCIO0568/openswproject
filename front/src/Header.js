import React from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

function Header() {
  const { isLoggedIn, username, handleLogout } = useAuth();
  const navigate = useNavigate();

  const handleMainClick = () => navigate('/');
  const handleLoginClick = () => navigate('/login');
  const handleLogoutClick = () => {
    handleLogout(); // 로그아웃 처리
    navigate('/login');
  };

  return (
    <header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px',
        borderBottom: '1px solid #ddd',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <button
          style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            background: 'none',
            color: '#000', // 글자색을 검정으로 명시
            border: 'none',
            cursor: 'pointer',
          }}
          onClick={handleMainClick}
              >
        기 뻔
      </button>

      <div>
        {isLoggedIn ? (
          <>
            <span style={{ marginRight: '10px', fontWeight: 'bold' }}>{username}</span>
            <button
              onClick={handleLogoutClick}
              style={{
                padding: '8px 16px',
                borderRadius: '4px',
                backgroundColor: '#FF6347',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              로그아웃
            </button>
          </>
        ) : (
          <button
            onClick={handleLoginClick}
            style={{
              padding: '8px 16px',
              borderRadius: '4px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            로그인
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;
