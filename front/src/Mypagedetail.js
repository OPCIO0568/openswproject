import React, { useState, useEffect } from "react";
import MyPage from "./MyPage";
import "./Mypagedetail.css";
import PostCard from "./PostCard";
import "./PostCard.css";
import axios from "axios";

function Mypagedetail() {
  const [userData, setUserData] = useState(null); // 사용자 데이터 저장
  const [getMoney, setGetMoney] = useState(""); // 충전 금액 입력 상태

  useEffect(() => {
    // 토큰 가져오기
    const token = localStorage.getItem("token");

    if (token) {
      // API 요청
      axios
        .get("http://localhost:8080/api/users/mypage", {
          headers: {
            Authorization: `Bearer ${token}`, // 토큰을 Authorization 헤더에 추가
          },
        })
        .then((response) => {
          setUserData(response.data); // 서버에서 받은 데이터 저장
        })
        .catch((error) => {
          console.error("사용자 정보 로드 실패:", error);
        });
    } else {
      alert("로그인이 필요합니다."); // 토큰 없을 시 알림
    }
  }, []);

  const handleCharge = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("로그인이 필요합니다."); // 토큰 없을 시 알림
      return;
    }

    if (!getMoney || getMoney <= 0) {
      alert("충전할 금액을 올바르게 입력하세요."); // 잘못된 입력 처리
      return;
    }

    // POST 요청으로 충전 처리
    axios
      .post(
        "http://localhost:8080/api/users/addbalance",
        { amount: parseFloat(getMoney) }, // JSON body로 충전 금액 전달
        {
          headers: {
            Authorization: `Bearer ${token}`, // Authorization 헤더 추가
          },
        }
      )
      .then((response) => {
        alert(response.data.message); // 성공 메시지 출력
        setGetMoney(""); // 입력 필드 초기화

        // 잔고 갱신을 위해 사용자 정보 다시 로드
        axios
          .get("http://localhost:8080/api/users/mypage", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => setUserData(res.data))
          .catch((err) => console.error("잔고 갱신 실패:", err));
      })
      .catch((error) => {
        console.error("충전 요청 실패:", error);
        alert("충전 요청에 실패했습니다. 다시 시도해주세요.");
      });
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
            <h2 className="Name">
              {userData ? userData.nickname : "로딩 중..."}
            </h2>
            <h2 className="subtitle">
              {userData ? ` ${userData.username}` : "로딩 중..."}
            </h2>
          </div>
        </div>
        <div className="inner-box2">
          <div className="nowmoeny">
            <h2>
              현재 잔고: {userData ? `${userData.balance} 원` : "로딩 중..."}
            </h2>
          </div>
          <div className="charge-container">
            <input
              id="getmoney"
              type="number"
              value={getMoney} // 입력 상태 바인딩
              onChange={(e) => setGetMoney(e.target.value)} // 입력 상태 업데이트
              placeholder="금액 입력" // 입력 필드 플레이스홀더
              className="charge-input"
            />
            <button onClick={handleCharge} className="charge-button">
              충전
            </button>
          </div>
        </div>
        <div className="all-donation-post">
          <div className="posts-container">
            {/* 게시글 카드 샘플 데이터 */}
            {userData &&
              userData.posts?.map((post) => (
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
