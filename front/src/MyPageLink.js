// src/MyPageLink.js
import React from 'react';

function MyPageLink() {
  return (
    <div style={{ paddingLeft: '20px', textAlign: 'center',}}>
      <h2>마이페이지</h2>
      <button
        onClick={() => alert("마이페이지로 이동")}
        style={{
          padding: '10px 20px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        마이페이지로 가기
      </button>
    </div>
  );
}

export default MyPageLink;
