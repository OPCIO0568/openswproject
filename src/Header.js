import React from 'react';
import { useNavigate } from 'react-router-dom';

function Header({ isLoggedIn, username, onLogout }) {
  const navigate = useNavigate();

  const handleMainClick = () => navigate('/');
  const handleLoginClick = () => navigate('/login');

  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px',
      borderBottom: '1px solid #ddd',
      fontFamily: 'Arial, sans-serif',
    }}>
      <button
        style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          background: 'none',
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
              onClick={onLogout}
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
