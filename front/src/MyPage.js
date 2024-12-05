import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MyPage.css'; // CSS 파일 가져오기

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
    const username = localStorage.getItem("username");

    if (!username) {
      alert("로그인 후 가능합니다.");
      navigate('/login'); // 로그인 페이지로 이동
      return;
    }

    navigate('/CreatePostPage'); // 글 생성 페이지로 이동
  };

  const handleLinkClick = (donationType) => {
    navigate("/AllDonationPost", { state: { donationType } });
  };

  return (
    <div className="mypage-container">
      <h2 className="mypage-title">마이페이지</h2>

      <button
        className="mypage-button mypage-main-button"
        onClick={handleNavigateToMyPage}
      >
        마이페이지로 가기
      </button>

      <button
        className="mypage-button mypage-create-button"
        onClick={handleNavigateToCreatePost}
      >
        글 생성
      </button>
      <div className="AllDonationPost-path">
        <a
          href="/AllDonationPost?type=1"
          className="mypage-link"
          onClick={(e) => {
            e.preventDefault(); // 기본 동작 방지
            handleLinkClick(1); // 커스텀 동작
          }}
        >
          기부 관련 게시물
        </a>
        <a
          href="/AllDonationPost?type=2"
          className="mypage-link"
          onClick={(e) => {
            e.preventDefault();
            handleLinkClick(2);
          }}
        >
          스타트업 관련 게시물
        </a>
        <a
          href="/AllDonationPost?type=3"
          className="mypage-link"
          onClick={(e) => {
            e.preventDefault();
            handleLinkClick(3);
          }}
        >
          펀딩 관련 게시물
        </a>
      </div>
    </div>
  );
}

export default MyPage;
