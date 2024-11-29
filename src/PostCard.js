import React from "react";
import "./PostCard.css";

function PostCard({ postNumber, image, title, subtitle, goalAmount, currentAmount }) {
  return (
    <div className="post-card">
      <img src={image} alt={`Post ${postNumber}`} className="post-image" />
      <div className="post-content">
        <h3>{title}</h3>
        <p>{subtitle}</p>
        <p>목표 금액: {goalAmount.toLocaleString()}원</p>
        <p>현재 금액: {currentAmount.toLocaleString()}원</p>
      </div>
    </div>
  );
}

export default PostCard;
