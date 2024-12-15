import React from 'react';

function Introduce() {
  return (
    <div
      style={{
        maxWidth: '800px',
        margin: '50px auto',
        padding: '30px',
        backgroundColor: '#f9f9f9',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        fontFamily: 'Arial, sans-serif',
        textAlign: 'center',
        lineHeight: '1.6',
      }}
    >
      <h1
        style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          marginBottom: '20px',
          color: '#333',
        }}
      >
        사이트 소개
      </h1>

      <p
        style={{
          fontSize: '1.2rem',
          color: '#555',
          marginBottom: '20px',
        }}
      >
        이 사이트는 사용자 간의 기부와 후원을 촉진하기 위해 만들어졌습니다. 사용자는 쉽게 프로젝트를 등록하고, 다양한 후원자와 소통할 수 있습니다.
      </p>

      <p
        style={{
          fontSize: '1.2rem',
          color: '#555',
          marginBottom: '20px',
        }}
      >
        신뢰할 수 있는 플랫폼을 제공하며, 공정하고 투명한 시스템을 통해 모든 거래가 안전하게 처리됩니다.
      </p>
    </div>
  );
}

export default Introduce;
