import React from 'react';

function MyPage() {
  return (
    <div style={{
      width: '100%', /* 부모 컨테이너 내에서 차지할 영역 */
      maxWidth: '250px', /* 최대 너비 설정 */
      padding: '20px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      backgroundColor: '#f9f9f9',
      boxSizing: 'border-box', /* 너비 계산에 padding 포함 */
    }}>
      <h2 style={{
        textAlign: 'center',
        fontSize: '1.5rem',
        margin: '0 0 20px 0',
      }}>
        마이페이지
      </h2>
      <button style={{
        width: '100%', /* 버튼이 카드의 너비에 맞게 */
        padding: '10px',
        borderRadius: '4px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: 'bold',
        transition: 'background-color 0.3s ease',
        marginTop: '10px',
      }}
      onMouseOver={(e) => e.target.style.backgroundColor = '#45a049'}
      onMouseOut={(e) => e.target.style.backgroundColor = '#4CAF50'}>
        마이페이지로 가기
      </button>
    </div>
  );
}

export default MyPage;
