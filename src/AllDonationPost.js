import React, { useState } from "react";
import MyPage from "./MyPage";
import PostCard from "./PostCard";
import "./PostCard.css"; // CSS 파일 가져오기
import "./SearchBar.css"; // 검색창 스타일링
import { FaSearch } from "react-icons/fa"; // 검색 아이콘 가져오기
import { Link } from "react-router-dom";

function AllDonationPost() {
  const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태

  // 게시글 데이터
  const posts = [
    {
      id: 1,
      postNumber: 1,
      image: "https://via.placeholder.com/150",
      title: "기부와 사랑의 첫 번째 게시글",
      subtitle: "첫 번째 게시글의 소제목입니다.",
      goalAmount: 1000000,
      currentAmount: 500000,
    },
    {
      id: 2,
      postNumber: 2,
      image: "https://via.placeholder.com/150",
      title: "두 번째 기부 프로젝트",
      subtitle: "두 번째 게시글의 소제목입니다.",
      goalAmount: 2000000,
      currentAmount: 1200000,
    },
    {
      id: 3,
      postNumber: 3,
      image: "https://via.placeholder.com/150",
      title: "환경을 위한 프로젝트",
      subtitle: "기부와 환경 보존의 만남",
      goalAmount: 3000000,
      currentAmount: 2500000,
    },
  ];

  // 검색 필터링
  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* 검색창 */}
      <div className="search-container">
        <FaSearch className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="제목을 입력해 게시물을 검색하세요."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* 전체 레이아웃 */}
      <div className="all-donation-post">
        {/* 게시글 목록 */}
        <div className="posts-container">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <PostCard
                key={post.id}
                postNumber={post.postNumber}
                image={post.image}
                title={post.title}
                subtitle={post.subtitle}
                goalAmount={post.goalAmount}
                currentAmount={post.currentAmount}
              />
            ))
          ) : (
            <p>검색 결과가 없습니다.</p>
          )}
        </div>

        {/* MyPage 컴포넌트 */}
        <div className="mypage-container">
          <MyPage />
        </div>
      </div>

      {/* 글생성 및 삭제 칸 */}
      <div className="action-container">
        <div className="create-box">
          <Link
            to="/AllDonationPost/CreatePostPage"
            style={{ textDecoration: "none", color: "inherit" }}
          >
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
