import React from "react";
import { useNavigate } from "react-router-dom";
import "./PostCard.css";

function PostCard({ id, postNumber, image, title, subtitle, goalAmount, currentAmount }) {
  const navigate = useNavigate();
  const progressPercentage = (currentAmount / goalAmount) * 100;

  const handleCardClick = () => {
    if (!id) {
      console.error("PostCard id is undefined.");
      return;
    }
    console.log(`Navigating to post with id: ${id}`); // Debugging log
    navigate(`/AllDonationPost/PostDetail/${id}`); // Navigate to the correct URL
  };

  return (
    <div className="post-card" onClick={handleCardClick} style={{ cursor: "pointer" }}>
      <img src={image} alt={`Post ${postNumber}`} className="post-image" />
      <div className="post-content">
        <h3>{title}</h3>
        <p>{subtitle}</p>
        <p className="ps">{progressPercentage.toFixed(2)}%</p>
        <p>목표 금액: {goalAmount.toLocaleString()}원</p>
        <p>현재 금액: {currentAmount.toLocaleString()}원</p>
      </div>
    </div>
  );
}

export default PostCard;
