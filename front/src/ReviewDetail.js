import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from './AuthContext'; 
import "./ReviewDetail.css";

function ReviewDetail() {
  const { reviewId } = useParams(); 
  const navigate = useNavigate();
  const { username: loggedInUsername } = useAuth(); 
  const [review, setReview] = useState(null); 
  const [comments, setComments] = useState([]); 
  const [newComment, setNewComment] = useState(""); 
  const [commentImage, setCommentImage] = useState(null); 
  const [reviewDataId, setReviewDataId] = useState(null); 

  useEffect(() => {
    const fetchReviewDetail = async () => {
      try {
        const reviewResponse = await axios.get(
          `http://localhost:8080/api/public/reviews/all`
        );

        const currentReview = reviewResponse.data.find(
          (review) => review.donationId === parseInt(reviewId)
        );

        if (currentReview) {
          setReviewDataId(currentReview.id); 
          setReview(currentReview); 
        }
      } catch (error) {
        console.error("리뷰 세부 정보 로드 실패:", error);
      }
    };

    const fetchComments = async () => {
      if (!reviewDataId) return;

      try {
        const response = await axios.get(
          `http://localhost:8080/api/public/reviews/${reviewDataId}/comments`
        );
        setComments(response.data); 
      } catch (error) {
        console.error("댓글 로드 실패:", error);
      }
    };

    fetchReviewDetail();
    fetchComments();
  }, [reviewId, reviewDataId]);

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) {
      alert("내용을 입력하세요.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("로그인이 필요합니다.");
        return;
      }

      const isReviewing = !review.isReviewed;
      const formData = new FormData();

      if (isReviewing && commentImage) {
        formData.append("file", commentImage);
      }
      
      formData.append(
        "data",
        JSON.stringify({
          content: newComment,
        })
      );

      const url = isReviewing
        ? `http://localhost:8080/api/reviews/${reviewDataId}/submit`
        : `http://localhost:8080/api/reviews/${reviewDataId}/comments`;

      const headers = isReviewing
        ? {
            Authorization: `Bearer ${token}`, 
            "Content-Type": "multipart/form-data",
          }
        : {
            Authorization: `Bearer ${token}`, 
            "Content-Type": "application/json",
          };

      const response = await axios.post(
        url,
        isReviewing ? formData : { content: newComment },
        { headers, withCredentials: true }
      );

      if (isReviewing && response.data.status === "success") {
        alert(response.data.message);
        window.location.reload();  // 새로고침
      } else {
        setComments((prevComments) => [
          ...prevComments,
          {
            id: response.data.id,
            content: newComment,
            createdBy: { username: loggedInUsername },
            createdAt: new Date().toISOString(),
          },
        ]);
        setNewComment(""); 
      }
    } catch (error) {
      console.error("작성 실패:", error);
      alert("작성 중 오류가 발생했습니다.");
    }
  };

  const handleOriginalPostClick = () => {
    navigate(`/AllDonationPost/PostDetail/${review.donationId}`);
  };

  return (
    <div className="review-detail-container">
      {review ? (
        <>
          <div className="maincontain">
            <img
              src={review.imagePath || "/images/default.jpg"}
              className="mainimage"
              alt={review.donationTitle}
            />
            <div className="plain-box">
              <h2>{review.donationTitle} - 후기</h2>
              <p>
                {review.isReviewed ? (
                  <>
                    <br />
                    <span className="review-content">
                      {review.content || "리뷰 내용이 없습니다."}
                    </span>
                  </>
                ) : (
                  "리뷰 미작성"
                )}
              </p>
              <button 
                className="original-post-button" 
                onClick={handleOriginalPostClick}
              >
                원 게시글 바로가기
              </button>
            </div>
          </div>

          <div className="review-contain">
            {loggedInUsername && (
              <div className="review-input-contain">
                <input
                  type="text"
                  placeholder={review.isReviewed ? "댓글을 입력하세요..." : "리뷰 내용을 입력하세요..."}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="review-input"
                />
                {!review.isReviewed && review.username === loggedInUsername && (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCommentImage(e.target.files[0])}
                    className="review-image-input"
                  />
                )}
                <button className="review-upload" onClick={handleCommentSubmit}>
                  {review.isReviewed ? "댓글 작성" : "리뷰 작성"}
                </button>
              </div>
            )}
            <div className="review-comment">
  {comments.length > 0 ? (
    comments.map((comment) => (
      <div key={comment.id} className="reviews">
        <p>{comment.content}</p>
        <div className="comment-meta">
          <span>작성자: {comment.createdBy.username}</span>
          <span style={{ marginLeft: "10px" }}>
            {new Date(comment.createdAt).toLocaleString()}
          </span>
        </div>
      </div>
    ))
  ) : (
    <p>댓글이 없습니다.</p>
  )}
</div>

          </div>
        </>
      ) : (
        <p>리뷰 정보를 불러오는 중입니다...</p>
      )}
    </div>
  );
}

export default ReviewDetail;
