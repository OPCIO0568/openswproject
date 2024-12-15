import React from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

function Header() {
  const { isLoggedIn, username, handleLogout } = useAuth();
  const navigate = useNavigate();

  const handleMainClick = () => navigate('/');
  const handleLoginClick = () => navigate('/login');
  const handleADClick = () => navigate('/AllDonationPost');
  const handleIntroClick = () => navigate('/Introduce');
  const handleReviewClick = () => navigate('/Review');
  const handleLogoutClick = () => {
    handleLogout(); // 로그아웃 처리
    navigate('/login');
  };

  return (
    <header
  style={{
    display: 'flex',
    justifyContent: 'flex-start',  // 왼쪽 정렬
    alignItems: 'center',
    padding: '10px',
    borderBottom: '1px solid #ddd',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: 'rgb(255, 255, 255)',
    gap: '20px'  // 버튼 간격 추가
  }}
>
  <button
    style={{
      fontSize: '2rem',
      fontWeight: 'bold',
      background: 'none',
      color: '#000',
      border: '2px solid #000',
      borderRadius: '10px',
      cursor: 'pointer',
      fontFamily: "'Playfair Display', serif",
    }}
    onClick={handleMainClick}
  >
    Giffun
  </button>

  <button
    style={{
      fontSize: '1.5rem',
      fontWeight: 'bold',
      background: 'none',
      color: '#000',
      padding: '5px 15px',
      cursor: 'pointer',
      fontFamily: "'Playfair Display', serif",
    }}
    onClick={handleIntroClick}
  >
    사이트 소개
  </button>

  <button
    style={{
      fontSize: '1.5rem',
      fontWeight: 'bold',
      background: 'none',
      color: '#000',
      padding: '5px 15px',
      cursor: 'pointer',
      fontFamily: "'Playfair Display', serif",
    }}
    onClick={handleReviewClick}
  >
    후기 게시판
  </button>

  <button
    style={{
      fontSize: '1.5rem',
      fontWeight: 'bold',
      background: 'none',
      color: '#000',
      padding: '5px 15px',
      cursor: 'pointer',
      fontFamily: "'Playfair Display', serif",
    }}
    onClick={handleADClick  }
  >
    게시판
  </button>

  <div style={{ marginLeft: 'auto' }}>
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
