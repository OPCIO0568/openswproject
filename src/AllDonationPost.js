import React from "react";
import Header from "./Header";
import MyPage from "./MyPage";
import PostCard from "./PostCard";
import "./PostCard.css"; // CSS 파일 가져오기
import { Link } from "react-router-dom";

function AllDonationPost() {
  const posts = [
    {
      id: 1,
      postNumber: 1,
      image: "https://via.placeholder.com/150",
      title: "첫 번째 게시글",
      subtitle: "첫 번째 게시글의 소제목입니다.",
      goalAmount: 1000000,
      currentAmount: 500000,
    },
    {
      id: 2,
      postNumber: 2,
      image: "https://via.placeholder.com/150",
      title: "두 번째 게시글",
      subtitle: "두 번째 게시글의 소제목입니다.",
      goalAmount: 2000000,
      currentAmount: 1200000,
    },
  ];

  return (
    <div>
      {/* 전체 레이아웃 */}
      <div className="all-donation-post">
        {/* 게시글 목록 */}
        <div className="posts-container">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              postNumber={post.postNumber}
              image={post.image}
              title={post.title}
              subtitle={post.subtitle}
              goalAmount={post.goalAmount}
              currentAmount={post.currentAmount}
            />
          ))}
        </div>

        {/* MyPage 컴포넌트 */}
        <div className="mypage-container">
          <MyPage />
        </div>
      </div>

      {/* 글생성 및 삭제 칸 */}
      <div className="action-container">
        <div className="create-box">
          <Link to="/AllDonationPost/CreatePostPage" style={{textDecoration: "none", color: "inherit"}}>
            <h4 style={{ margin: 0 }}>글생성</h4>
          </Link>
        </div>
        <div className="delete-box">
          <h4 style={{ margin: 0 }}>삭제</h4>
        </div>
      </div>
    </div>
  );
}

export default AllDonationPost;
