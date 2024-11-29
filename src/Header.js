// src/Header.js
import React from 'react';

function Header() {
  return (
    <header style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
      borderBottom: '1px solid #ddd',
      position: 'relative',
      fontFamily: 'Arial, sans-serif' // 기본 폰트 설정
    }}>
      {/* 가운데에 고정된 헤더 제목 */}
      <h1 style={{ margin: 0 }}>기 뻔</h1>

      {/* 오른쪽에 위치한 로그인 버튼 */}
      <div style={{ position: 'absolute', right: '20px' }}>
        <button style={{
          padding: '8px 16px',
          borderRadius: '4px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          fontFamily: 'inherit', // 상위 폰트 상속
        }}>
          로그인
        </button>
      </div>
    </header>
  );
}

export default Header;
