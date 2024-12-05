import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import PostCard from "./PostCard";
import "./PostCard.css";
import "./SearchBar.css"; // 검색창 스타일링
import axios from "axios";
import MyPage from "./MyPage";
import { FaSearch } from "react-icons/fa"; // 검색 아이콘 가져오기
import {useBackground} from './BackgroundContext';

function AllDonationPost() {
  const { setBackgroundImage } = useBackground();

  useEffect(() => {
    setBackgroundImage('https://vrthumb.imagetoday.co.kr/2021/05/13/twi001t3391317.jpg'); // 페이지에 맞는 배경 이미지 설정
  }, [setBackgroundImage]);

  const location = useLocation();
  const donationType = location.state?.donationType || null; // 전달받은 donationType
  const [posts, setPosts] = useState([]); // 게시글 상태 관리
  const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태

  useEffect(() => {
    // GET 요청으로 게시글 데이터 가져오기
    axios
      .get("http://localhost:8080/api/public/donations/all", {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        // 데이터의 data 속성에서 게시글 리스트를 가져옴
        let fetchedPosts = response.data.data
          .map((item) => ({
            id: item.id,
            postNumber: item.donationType,
            image: item.mainImage,
            title: item.title,
            subtitle: item.subtitle,
            goalAmount: item.goalAmount,
            currentAmount: item.collectedAmount,
          }))
          .sort((a, b) => b.id - a.id); // 내림차순 정렬

        // donationType이 있을 경우 해당 타입의 포스트만 필터링
        if (donationType !== null) {
          fetchedPosts = fetchedPosts.filter(
            (post) => post.postNumber === donationType
          );
        }

        setPosts(fetchedPosts);
      })
      .catch((error) => {
        console.error("데이터 가져오기 실패:", error);
      });
  }, [donationType]); // donationType을 의존성 배열에 추가

  // 검색 필터링
  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className="all-donation-container"
      style={{ display: "flex", flexDirection: "column", height: "100vh" }}
    >
      {/* 검색창 */}
      <div className="search-container" style={{ margin: "20px 0" }}>
        <FaSearch className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="제목을 입력해 게시물을 검색하세요."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div style={{ display: "flex", flex: 1 }}>
        {/* 게시글 목록 */}
        <div
          className="all-donation-posts"
          style={{ flex: 4, padding: "20px", overflowY: "auto" }}
        >
          <div
            className="posts-container"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              gap: "20px",
            }}
          >
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <PostCard
                  key={post.id}
                  id={post.id} // id 전달
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
        </div>

        {/* 우측 마이페이지 */}
        <div
          className="mypage-container"
          style={{
            flex: 1,
            backgroundColor: "#f9f9f9",
            borderLeft: "1px solid #ddd",
            padding: "20px",
          }}
        >
          <MyPage />
        </div>
      </div>
    </div>
  );
}

export default AllDonationPost;
