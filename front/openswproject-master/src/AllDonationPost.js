import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import PostCard from "./PostCard";
import "./PostCard.css";
import axios from "axios";
import MyPage from "./MyPage";

function AllDonationPost() {
  const location = useLocation();
  const donationType = location.state?.donationType || 1; // 전달받은 donationType
  const [posts, setPosts] = useState([]); // 게시글 상태 관리

  useEffect(() => {
    // POST 요청으로 게시글 데이터 가져오기
    axios
      .post(
        "http://localhost:8080/api/public/donations/search",
        { donationType },
        { headers: { "Content-Type": "application/json" } }
      )
      .then((response) => {
        const fetchedPosts = response.data.map((item) => ({
          id: item.id,
          postNumber: item.donationType,
          image: item.mainImage,
          title: item.title,
          subtitle: item.subtitle,
          goalAmount: item.goalAmount,
          currentAmount: item.collectedAmount,
        }));
        setPosts(fetchedPosts);
      })
      .catch((error) => {
        console.error("데이터 가져오기 실패:", error);
      });
  }, [donationType]);

  return (
    <div className="all-donation-container" style={{ display: "flex", height: "100vh" }}>
      {/* 게시글 목록 */}
      <div className="all-donation-posts" style={{ flex: 4, padding: "20px", overflowY: "auto" }}>
        <div className="posts-container" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px" }}>
          {posts.map((post) => (
            <PostCard
              key={post.id}
              id={post.id} // Explicitly pass the id
              postNumber={post.postNumber}
              image={post.image}
              title={post.title}
              subtitle={post.subtitle}
              goalAmount={post.goalAmount}
              currentAmount={post.currentAmount}
            />
          ))}
        </div>
      </div>

      {/* 우측 마이페이지 */}
      <div className="mypage-container" style={{ flex: 1, backgroundColor: "#f9f9f9", borderLeft: "1px solid #ddd", padding: "20px" }}>
        <MyPage />
      </div>
    </div>
  );
}

export default AllDonationPost;
