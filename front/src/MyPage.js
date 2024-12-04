import React from 'react';
import { useNavigate } from 'react-router-dom';

function MyPage() {
  const navigate = useNavigate();

  

  const handleNavigateToMyPage = () => {
    const username = localStorage.getItem("username");

    if (!username) {
      alert("로그인 후 가능합니다.");
      navigate('/login'); // 로그인 페이지로 이동
      return;
    }
    
    navigate('/Mypagedetail');
  };

  const handleNavigateToCreatePost = () => {
    // 로그인 여부 확인
    const username = localStorage.getItem("username");

    if (!username) {
      alert("로그인 후 가능합니다.");
      navigate('/login'); // 로그인 페이지로 이동
      return;
    }

    navigate('/CreatePostPage'); // 글 생성 페이지로 이동
  };

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '250px',
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        backgroundColor: '#f9f9f9',
        boxSizing: 'border-box',
      }}
    >
      <h2
        style={{
          textAlign: 'center',
          fontSize: '1.5rem',
          margin: '0 0 20px 0',
        }}
      >
        마이페이지
      </h2>

      <button
        style={{
          width: '100%',
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
        onMouseOut={(e) => e.target.style.backgroundColor = '#4CAF50'}
        onClick={handleNavigateToMyPage}
      >
        마이페이지로 가기
      </button>

      {/* 글 생성 버튼 클릭 시 로그인 상태 확인 */}
      <button
        style={{
          width: '100%',
          padding: '10px',
          borderRadius: '4px',
          backgroundColor: '#FF6347',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          fontSize: '1rem',
          fontWeight: 'bold',
          transition: 'background-color 0.3s ease',
          marginTop: '10px',
        }}
        onMouseOver={(e) => e.target.style.backgroundColor = '#FF4500'}
        onMouseOut={(e) => e.target.style.backgroundColor = '#FF6347'}
        onClick={handleNavigateToCreatePost}
      >
        글 생성
      </button>
    </div>
  );
}

export default MyPage;
