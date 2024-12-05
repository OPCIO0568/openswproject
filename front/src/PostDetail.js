import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import "./PostDetail.css";
import MyPage from "./MyPage";

function PostDetail() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [donationAmount, setDonationAmount] = useState(""); // 후원 금액 상태
  const [username, setUsername] = useState(""); // 현재 로그인된 사용자 이름 상태
  const [isEditing, setIsEditing] = useState(false); // 수정 모드 상태
  const [editedDescription, setEditedDescription] = useState(""); // 수정 중인 내용 상태

  const fetchPostDetail = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/public/donations/detail/${postId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch post details.");
      }

      const data = await response.json();
      setPost(data.data);
      setEditedDescription(data.data.description); // 초기값 설정
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchPostDetail();

    const storedUsername = localStorage.getItem("username");
    setUsername(storedUsername || "");
  }, [fetchPostDetail]);

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
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:8080/api/private/donations/donate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ id: postId, amount: parseFloat(donationAmount) }),
        }
      );

      if (!response.ok) {
        throw new Error("후원 요청에 실패했습니다.");
      }

      const result = await response.json();
      alert(`후원 성공! ${result.message}`);
      setDonationAmount("");

      fetchPostDetail();
    } catch (error) {
      alert(`후원 실패: ${error.message}`);
    }
  };

  const handleLike = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8080/api/private/donations/like/${postId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("좋아요 요청에 실패했습니다.");
      }

      const result = await response.json();
      alert(`${result.message}`);
      fetchPostDetail();
    } catch (error) {
      alert(`${error.message}`);
    }
  };

  const handleDeletePost = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:8080/api/private/donations/delete/${postId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("게시글 삭제에 실패했습니다.");
      }

      alert("게시글이 삭제되었습니다.");
      window.location.href = "/AllDonationPost";
    } catch (error) {
      alert(`게시글 삭제 실패: ${error.message}`);
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8080/api/private/donations/update/${postId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ description: editedDescription }),
        }
      );

      if (!response.ok) {
        throw new Error("게시글 수정에 실패했습니다.");
      }

      alert("게시글이 수정되었습니다.");
      setIsEditing(false); // 수정 모드 종료
      fetchPostDetail(); // 수정된 내용 다시 가져오기
    } catch (error) {
      alert(`게시글 수정 실패: ${error.message}`);
    }
  };

  if (loading) {
    return <div className="post-detail-container">로딩 중...</div>;
  }

  if (error) {
    return <div className="post-detail-container">에러 발생: {error}</div>;
  }

  if (!post) {
    return <div className="post-detail-container">게시물을 찾을 수 없습니다.</div>;
  }

  const progressPercentage = (post.collectedAmount / post.goalAmount) * 100;

  return (
    <div className="post-detail-layout">
      <div className="post-detail-container">
        <div className="post-detail-upper-box">
          <div className="post-detail-image-container">
            <img
              src={post.mainImage}
              alt={post.title}
              className="post-detail-image"
            />
          </div>
          <div className="post-detail-info-container">
            <h2 className="post-detail-title">{post.title}</h2>
            <h4 className="post-detail-subtitle">{post.subtitle}</h4>
            <p className="post-detail-stats">
              목표 금액: {post.goalAmount.toLocaleString()}원
            </p>
            <p className="post-detail-stats">
              현재 금액: {post.collectedAmount.toLocaleString()}원
            </p>
            <p className="post-detail-stats">
              목표 달성률: {progressPercentage.toFixed(2)}%
            </p>
            <div className="progress-bar-container">
              <div
                className="progress-bar-fill"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>

            {/* 후원하기 UI */}
            <div className="post-detail-donation-button">
              <input
                type="number"
                value={donationAmount}
                onChange={(e) => setDonationAmount(e.target.value)}
                placeholder="금액 입력 (원)"
                className="donation-input"
              />
              <button className="donation-button" onClick={handleDonation}>
                후원하기
              </button>
            </div>

            <div className="post-detail-buttons">
              <button className="like-button" onClick={handleLike}>
                👍
              </button>
              <button
                className="share-button"
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
        </div>

        <div className="post-detail-middle-box">
          <span className="creator-name">작성자 : {post.username}</span>
          <span className="creator-name">👍 : {post.likeCount}</span>
          {username === post.username && (
            <>
              {isEditing ? (
                <button className="post-save-button" onClick={handleSave}>
                  저장
                </button>
              ) : (
                <button
                  className="post-edit-button"
                  onClick={() => setIsEditing(true)}
                >
                  게시글 수정
                </button>
              )}
              <button className="post-delete-button" onClick={handleDeletePost}>
                게시글 삭제
              </button>
            </>
          )}
        </div>

        <div className="post-detail-lower-box">
          <h3 className="post-detail-description-title">부가 설명</h3>
          {isEditing ? (
            <textarea
              className="post-edit-textarea"
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
            />
          ) : (
            <p className="post-detail-description">{post.description}</p>
          )}
        </div>
      </div>
      <div className="mypage-container">
        <MyPage />
      </div>
    </div>
  );
}

export default PostDetail;
