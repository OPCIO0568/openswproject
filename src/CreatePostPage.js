import React, { useState } from "react";
import { useNavigate } from "react-router-dom";



function CreatePostPage() {
  const [title, setTitle] = useState(""); // 제목 상태
  const [subtitle] = useState(""); // 소제목 상태
  const [content, setContent] = useState(""); // 본문 상태
  const [images, setImages] = useState([]); // 이미지 파일 상태
  const navigate = useNavigate();
    /*useState는 React에서 컴포넌트 상태를 관리하기 위해 사용되는 기능
    title: 사용자가 입력한 게시물의 제목을 저장하는 상태입니다.
    setTitle: 사용자가 입력한 제목 값이 바뀔 때 이 값을 업데이트하는 함수입니다.
    content: 사용자가 입력한 게시물의 본문 내용을 저장하는 상태입니다.
    setContent: 본문 입력 필드에서 사용자가 입력한 내용을 업데이트하는 함수입니다.
    goalAmount: 사용자가 입력한 목표 금액을 저장하는 상태입니다.
    setGoalAmount: 목표 금액 입력 필드에서 입력된 값을 업데이트하는 함수입니다.
    입력 필드에 값을 입력하면 onchange 이벤트가 발생 -> 얘가 set..들을 사용해서 상태들을 업데이트함
    동적으로 데이터 관리가능
    */
  
    // handleSubmit 함수 정의
    const handleSubmit = (e) => {
      e.preventDefault(); // 폼 제출의 페이지 새로고침을 막음
  
      const formData = new FormData(); // 이미지와 텍스트 데이터를 함께 전송하기 위해 FormData 사용
      formData.append("title", title);
      formData.append("subtitle", subtitle);
      formData.append("content", content);
      //사용자가 입력한 데이터를 모아서 저장
      /* 얘는 사용자가 폼을 제출할 때 호출되는 이벤트 핸들러

      */
      images.forEach((image, index) => {
        formData.append(`image${index + 1}`, image); // 각각의 이미지를 FormData에 추가
      });
  
      // POST 요청으로 백엔드에 데이터 전송
      fetch("http://localhost:8080/api/posts", { //여기로 데이터 전송
        //fetch는 서버와 HTTP 요청을 주고받기 위한 브라우저 내장 함수
        method: "POST", // 새로운 게시물을 서버에 저장하기 위해 POST요청
        body: formData,
        // body: JSON.stringify(newPost), NEWPOST객체를 JSON형식의 문자열로 변환하여 서버로 보냄
      })
        .then((response) => { //서버의 응답을 처리
          if (!response.ok) { //상태코드가 성공(200)이 아닌경우 에러
            throw new Error("데이터 전송에 실패했습니다.");
          }
          return response.json(); //본문을 JSON객체로 변환
        })
        .then((data) => { //성공적으로 데이터도 받았으면 후속작업
          console.log("작성된 게시물:", data);
          alert("글이 성공적으로 작성되었습니다!");
          navigate("/AllDonationPost"); // 글작성 후 게시물 목록으로 이동
        })
        .catch((error) => { //요청중 발생한 에러를 처리
          console.error("에러 발생:", error.message); //에러 메세지를 콘솔에 출력하여 디버깅에 도움을 줌
          alert("글 작성 중 에러가 발생했습니다.");
        });
    };

    const handleImageChange = (e) => {
      const files = Array.from(e.target.files); // 파일 배열로 변환
      setImages(files); // 상태 업데이트
    };
  
    return (
    /*return문 안에 작성된 JSX를 렌더링하여 사용자 화면에 표시
    return안에 포함된 내용은 사용자가 볼 화면을 정의 */
      <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
        <h2>글 작성</h2>
        <form onSubmit={handleSubmit} /*폼이 제출된때 호출되는 이벤트 핸들러 */>
          {/* 제목 입력 */}
          <div style={{ marginBottom: "15px" }}>
            <label htmlFor="title" style={{ display: "block"/*라벨이 입력필드 위에 위치*/, fontWeight: "bold" }}>
              제목
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              // 입력값 변경 시 상태를 업데이트
              required
              //값 입력을 필수로 
              placeholder="제목을 입력하세요"
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "4px",
              }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label htmlFor="title" style={{ display: "block"/*라벨이 입력필드 위에 위치*/, fontWeight: "bold" }}>
              소제목
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              // 입력값 변경 시 상태를 업데이트
              required
              //값 입력을 필수로 
              placeholder="소제목을 입력하세요"
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "4px",
              }}
            />
          </div>
  
          {/* 본문 입력 */}
          <div style={{ marginBottom: "15px" }}>
            <label htmlFor="content" style={{ display: "block", fontWeight: "bold" }}>
              본문
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
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
              이미지 업로드 (최대 3개)
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