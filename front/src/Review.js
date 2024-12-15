import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import { useAuth } from './AuthContext';
import "./Review.css";

function Review() {
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();
  const { username: loggedInUsername } = useAuth(); 

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const reviewResponse = await axios.get("http://localhost:8080/api/public/reviews/all", {
          headers: {
            "Content-Type": "application/json",
          },
        });

        const filteredReviews = reviewResponse.data
          .filter((review) => review.isReviewed || review.username === loggedInUsername)
          .map((review) => ({
            id: review.donationId,
            title: review.donationTitle,
            image: review.imagePath,
            isReviewed: review.isReviewed,
            username: review.username,
          }))
          .sort((a, b) => a.isReviewed - b.isReviewed || b.id - a.id); // 미작성 우선 + ID 내림차순

        setReviews(filteredReviews);
      } catch (error) {
        console.error("데이터 로드 실패:", error);
      }
    };

    fetchReviews();
  }, [loggedInUsername]);

  const handleReviewClick = (id) => {
    navigate(`/ReviewDetail/${id}`);
  };

  return (
    <div className="review-container">
      {reviews.length > 0 ? (
        reviews.map((review, index) => (
          <div
            key={index}
            className="review-box"
            onClick={() => handleReviewClick(review.id)}
            style={{ cursor: "pointer" }}
          >
            {review.image && (
              <img src={review.image} alt={review.title} className="review-image" />
            )}
            <p 
              className={`review-title ${!review.isReviewed ? "unreviewed-title" : ""}`}
            >
              {review.title}
            </p>
            <div className="review-progress">
              <p className="review-status">
                리뷰 작성 상태: {review.isReviewed ? "작성 완료" : "미작성"}
              </p>
            </div>
          </div>
        ))
      ) : (
        <p>등록된 리뷰가 없습니다.</p>
      )}
    </div>
  );
}

export default Review;
