import React, { useState } from "react"; // Added useState import
import MyPage from "./MyPage";
import "./Mypagedetail.css";
import PostCard from "./PostCard";
import "./PostCard.css";

function Mypagedetail() {
  const posts = [
    {
      id: 1,
      postNumber: 1,
      image: "https://via.placeholder.com/150",
      title: "첫 번째 게시글",
      subtitle: "첫 번째 게시글의 소제목입니다.",
      goalAmount: 1000000,
      currentAmount: 500000,
    }

  ];

  const [getMoney, setGetMoney] = useState(""); // State for input value

  const handleClick = () => {
    console.log(getMoney); // Log the input value
    alert(`입력된 값: ${getMoney}`); // Display the input value in an alert
  };

  return (
    <div className="mypagedetail-container">
      {/* 프로필 박스 */}
      <div className="profileBox">
        <div className="inner-box">
          <img
            className="profileimage"
            src="/defaultprofile.png"
            alt="Default Profile"
          />
          <div className="namebox">
            <h2 className="Name">유저이름</h2>
            <h2 className="subtitle">소제목</h2>
          </div>
        </div>
        <div className="inner-box2">
          <div className="nowmoeny"> 
            <h2>현재 잔고 : money</h2>
          </div>
          <div className="charge-container">
            <input
              id="getmoney"
              type="number"
              value={getMoney} // Bind state to input value
              onChange={(e) => setGetMoney(e.target.value)} // Update state on change
              placeholder="금액 입력" // Placeholder 추가
              className="charge-input"
            />
            <button onClick={handleClick} className="charge-button">
              충전
            </button>
          </div>
        </div>
        <div className="all-donation-post">
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
        </div>
      </div>
      {/* MyPage 컴포넌트 */}
      <div className="mypage-container">
        <MyPage />
      </div>
    </div>
  );
}

export default Mypagedetail;
