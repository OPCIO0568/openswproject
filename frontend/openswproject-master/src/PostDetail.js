import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./PostDetail.css"; // Add custom CSS styles
import MyPage from "./MyPage";

function PostDetail() {
  const { postId } = useParams(); // Extract the postId from the route
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [donationAmount, setDonationAmount] = useState(""); // State for donation amount
  const [username, setUsername] = useState(""); // State for logged-in user

  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/donations/detail", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: postId }), // Send postId to the backend
        });

        if (!response.ok) {
          throw new Error("Failed to fetch post details.");
        }

        const data = await response.json();
        setPost(data); // Store fetched data in state
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    // Simulating fetching logged-in username
    const fetchUsername = () => {
      const storedUsername = localStorage.getItem("username");
      setUsername(storedUsername || ""); // Set username if found in localStorage
    };

    fetchPostDetail();
    fetchUsername();
  }, [postId]); // Fetch data whenever postId changes

  const handleDonation = async () => {
    if (!username) {
      alert("로그인 후 가능합니다.");
      return;
    }

    if (!donationAmount || donationAmount <= 0) {
      alert("후원 금액을 올바르게 입력하세요.");
      return;
    }

    try {
      const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
      const response = await fetch("http://localhost:8080/api/donations/donate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include token for authentication
        },
        body: JSON.stringify({ id: postId, amount: parseFloat(donationAmount) }),
      });

      if (!response.ok) {
        throw new Error("후원 요청에 실패했습니다.");
      }

      const result = await response.json();
      alert(`후원 성공! ${result.message}`);
      setDonationAmount(""); // Reset the donation amount input field

      // Fetch the updated post details after donation
      fetchPostDetail(); // Re-fetch the updated data
    } catch (error) {
      alert(`후원 실패: ${error.message}`);
    }
  };

  const fetchPostDetail = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/donations/detail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: postId }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch post details.");
      }

      const data = await response.json();
      setPost(data); // Update post data with the latest info
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="post-detail-container">Loading...</div>;
  }

  if (error) {
    return <div className="post-detail-container">Error: {error}</div>;
  }

  if (!post) {
    return <div className="post-detail-container">Post not found.</div>;
  }

  const progressPercentage = (post.collectedAmount / post.goalAmount) * 100;

  return (
    <div className="post-detail-layout">
      {/* Main Post Details */}
      <div className="post-detail-container">
        <div className="post-detail-upper-box">
          {/* Left: Post Image */}
          <div className="post-detail-image-container">
            <img src={post.mainImage} alt={post.title} className="post-detail-image" />
          </div>

          {/* Right: Post Info */}
          <div className="post-detail-info-container">
            <h2 className="post-detail-title">{post.title}</h2>
            <h4 className="post-detail-subtitle">{post.subtitle}</h4>
            <p className="post-detail-stats">목표 금액: {post.goalAmount.toLocaleString()}원</p>
            <p className="post-detail-stats">현재 금액: {post.collectedAmount.toLocaleString()}원</p>
            <p className="post-detail-stats">목표 달성률: {progressPercentage.toFixed(2)}%</p>
            <div className="progress-bar-container">
              <div
                className="progress-bar-fill"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>

            {/* Donation Input and Button */}
            <div className="donation-container">
              <input
                type="number"
                value={donationAmount}
                onChange={(e) => setDonationAmount(e.target.value)}
                placeholder="금액 입력 (원)"
                className="donation-input"
              />
              <button className="post-detail-button" onClick={handleDonation}>
                후원하기
              </button>
            </div>

            <button
              className="post-detail-share-button"
              onClick={() =>
                navigator.share
                  ? navigator.share({
                      title: post.title,
                      text: post.subtitle,
                      url: window.location.href,
                    })
                  : alert("공유 기능을 지원하지 않는 브라우저입니다.")
              }
            >
              공유하기
            </button>
          </div>
        </div>

        {/* Post Description */}
        <div className="post-detail-lower-box">
          <h3 className="post-detail-description-title">부가 설명</h3>
          <p className="post-detail-description">{post.description}</p>
        </div>
      </div>

      {/* Right: MyPage */}
      <div className="mypage-container">
        <MyPage />
      </div>
    </div>
  );
}

export default PostDetail;
