import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./PostDetail.css"; // CSS 파일 가져오기
import MyPage from "./MyPage";

function PostDetail() {
  const { postId } = useParams(); // URL에서 postId 가져오기
  const [post, setPost] = useState(null); // 게시물 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/posts/${postId}`); // API 호출
        if (!response.ok) {
          throw new Error("데이터를 가져오는 데 실패했습니다.");
        }
        const data = await response.json();
        setPost(data); // 상태에 데이터 저장
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]); // postId 변경 시 데이터 다시 가져오기

  if (loading) {
    return <div className="post-detail-container">로딩 중...</div>;
  }

  if (error) {
    return <div className="post-detail-container">에러 발생: {error}</div>;
  }

  if (!post) {
    return <div className="post-detail-container">게시물을 찾을 수 없습니다.</div>;
  }

  return (
    <div className="post-detail-layout">
      {/* 왼쪽: 게시물 상세 */}
      <div className="post-detail-container">
        {/* 위쪽 박스 */}
        <div className="post-detail-upper-box">
          {/* 왼쪽: 이미지 */}
          <div className="post-detail-image-container">
            <img
              src={post.image} // 백엔드에서 받은 이미지 URL
              alt={post.title} // 이미지 대체 텍스트
              className="post-detail-image"
            />
          </div>

          {/* 오른쪽: 정보 */}
          <div className="post-detail-info-container">
            <h2 className="post-detail-title">{post.title}</h2>
            <h4 className="post-detail-subtitle">{post.subtitle}</h4>
            <p className="post-detail-stats">
              목표 금액: {post.goalAmount.toLocaleString()}원
            </p>
            <p className="post-detail-stats">
              현재 금액: {post.currentAmount.toLocaleString()}원
            </p>
            <p className="post-detail-stats">
              목표 달성률: {Math.floor((post.currentAmount / post.goalAmount) * 100)}%
            </p>


            <div className="progress-bar-container">
              <div
                className="progress-bar-fill"
                style={{
                  width: `${(post.currentAmount / post.goalAmount) * 100}%`,
                }}
              ></div>
            </div>
            <div className="post-detail-buttons">
              <button className="post-detail-button">후원하기</button>
              <button
                className="post-detail-share-button"
                onClick={() =>
                  navigator.share
                    ? navigator.share({
                        title: post.title,
                        text: post.subtitle,
                        url: window.location.href, // 현재 페이지 URL
                      })
                    : alert("공유 기능을 지원하지 않는 브라우저입니다.")
                }
              >공유하기
              </button>
            </div>
          </div>
        </div>

        {/* 프로필 섹션 */}
        <div className="post-detail-profile">
          <div className="profile-image-container">
            <img
              src={post.profileImage} // 프로필 이미지 URL
              alt={`${post.authorName} 프로필`}
              className="profile-image"
            />
          </div>
          <div className="profile-info-container">
            <p className="profile-author-name">{post.authorName}</p>
            <p className="profile-description">{post.authorDescription}</p>
          </div>
        </div>

        {/* 아래쪽 박스 */}
        <div className="post-detail-lower-box">
          <h3 className="post-detail-description-title">부가 설명</h3>
          <p className="post-detail-description">{post.description}</p>
        </div>

      </div>
      {/* 오른쪽: 마이페이지 */}
      <div className="mypage-container">
        <MyPage />
      </div>
    </div>

    

  );
}

export default PostDetail;
