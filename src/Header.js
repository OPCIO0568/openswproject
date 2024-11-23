import React from 'react';
import { useNavigate } from 'react-router-dom';

function Header({ isLoggedIn, username, onLogout }) {
  const navigate = useNavigate();

  const handleMainClick = () => {
    navigate('/');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <header style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
      borderBottom: '1px solid #ddd',
      position: 'relative',
      fontFamily: 'Arial, sans-serif'
    }}>
      <button
        style={{
          margin: 0,
          background: 'none',
          border: 'none',
          padding: 0,
          fontSize: '2rem',
          fontWeight: 'bold',
          fontFamily: 'Arial, sans-serif',
          cursor: 'pointer',
          color: "black",
        }}
        onClick={handleMainClick}
      >
        기 뻔
      </button>

      <div style={{ position: 'absolute', right: '20px' }}>
        {isLoggedIn ? (
          <>
            <span style={{ marginRight: '10px' }}>{username}</span>
            <button
              onClick={onLogout}
              style={{
                padding: '8px 16px',
                borderRadius: '4px',
                backgroundColor: '#FF6347',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'inherit',
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
              fontFamily: 'inherit',
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
