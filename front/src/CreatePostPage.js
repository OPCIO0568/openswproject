import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreatePostPage() {
  const [title, setTitle] = useState(""); // 제목 상태
  const [subtitle, setSubtitle] = useState(""); // 소제목 상태
  const [goalAmount, setGoalAmount] = useState(""); // 목표 금액 상태
  const [description, setDescription] = useState(""); // 본문 상태 (content에서 description으로 변경)
  const [images, setImages] = useState([]); // 이미지 파일 상태
  const [donationType, setDonationType] = useState(""); // 기부 종류 상태
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault(); // 폼 제출의 페이지 새로고침을 막음

    const formData = new FormData(); // 이미지와 텍스트 데이터를 함께 전송하기 위해 FormData 사용
    
    // Append data as JSON under "data"
    formData.append("data", JSON.stringify({
      title,
      subtitle,
      description, // 'content'에서 'description'으로 변경
      goalAmount,
      donationType,
    }));

    // Add files to FormData (if any)
    images.forEach((image) => {
      formData.append("file", image); // Assuming each image is appended under "file"
    });

    // Get token from localStorage
    const token = localStorage.getItem("token");

    // POST 요청으로 백엔드에 데이터 전송
    fetch("http://localhost:8080/api/private/donations/create", {
      method: "POST", // 새로운 게시물을 서버에 저장하기 위해 POST요청
      headers: {
        Authorization: `Bearer ${token}`, // Adding token to Authorization header
      },
      body: formData, // The form data including the images and text data
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("데이터 전송에 실패했습니다.");
        }
        return response.json(); // 본문을 JSON 객체로 변환
      })
      .then((data) => {
        console.log("작성된 게시물:", data);
        alert("글이 성공적으로 작성되었습니다!");
        navigate("/AllDonationPost"); // 글 작성 후 게시물 목록으로 이동
      })
      .catch((error) => {
        console.error("에러 발생:", error.message);
        alert("글 작성 중 에러가 발생했습니다.");
      });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files); // 파일 배열로 변환
    setImages(files); // 상태 업데이트
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h2>글 작성</h2>
      <form onSubmit={handleSubmit}>
        {/* 제목 입력 */}
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="title" style={{ display: "block", fontWeight: "bold" }}>
            제목
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="제목을 입력하세요"
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "4px",
            }}
          />
        </div>

        {/* 소제목 입력 */}
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="subtitle" style={{ display: "block", fontWeight: "bold" }}>
            소제목
          </label>
          <input
            type="text"
            id="subtitle"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            required
            placeholder="소제목을 입력하세요"
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "4px",
            }}
          />
        </div>

        {/* 목표 금액 입력 */}
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="goalAmount" style={{ display: "block", fontWeight: "bold" }}>
            금액
          </label>
          <input
            id="goalAmount"
            type="number"
            value={goalAmount}
            onChange={(e) => {
              const value = e.target.value;
              if (value >= 0) {
                setGoalAmount(value); // 목표 금액 상태 업데이트
              }
            }}
            required
            placeholder="금액을 입력하세요"
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "4px",
            }}
            min="0" // 최소 값 0 (음수는 불가능)
          />
        </div>

        {/* 기부 유형 선택 */}
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="donationType" style={{ display: "block", fontWeight: "bold" }}>
            기부 유형
          </label>
          <select
            id="donationType"
            value={donationType}
            onChange={(e) => setDonationType(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "4px",
            }}
          >
            <option value="">기부 유형을 선택하세요</option>
            <option value="1">기부</option>
            <option value="2">스타트업 후원</option>
            <option value="3">펀딩 상품</option>
          </select>
        </div>

        {/* 본문 입력 */}
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="description" style={{ display: "block", fontWeight: "bold" }}>
            본문
          </label>
          <textarea
            id="description" // 'content'에서 'description'으로 ID 변경
            value={description} // 'content'에서 'description'으로 상태 변경
            onChange={(e) => setDescription(e.target.value)} // 'content'에서 'description'으로 상태 업데이트
            required
            placeholder="본문을 입력하세요"
            style={{
              width: "100%",
              height: "100px",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "4px",
            }}
          ></textarea>
        </div>

        {/* 이미지 업로드 */}
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="images" style={{ display: "block", fontWeight: "bold" }}>
            이미지 업로드
          </label>
          <input
            type="file"
            id="images"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            style={{
              display: "block",
              marginTop: "10px",
            }}
          />
          {images.length > 0 && (
            <div style={{ marginTop: "10px" }}>
              {images.map((image, index) => (
                <p key={index} style={{ fontSize: "14px", marginBottom: "5px" }}>
                  {image.name}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* 제출 버튼 */}
        <button
          type="submit"
          style={{
            backgroundColor: "#4CAF50",
            color: "white",
            padding: "10px 15px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          작성하기
        </button>
      </form>
    </div>
  );
}

export default CreatePostPage;
