import React, { useState, useEffect } from "react";
import MyPage from "./MyPage";
import "./Mypagedetail.css";
import PostCard from "./PostCard";
import "./PostCard.css";
import axios from "axios";

function Mypagedetail() {
  const [userData, setUserData] = useState({ posts: [] }); // 사용자 데이터 저장
  const [getMoney, setGetMoney] = useState(""); // 충전 금액 입력 상태
  const [editingNickname, setEditingNickname] = useState(false); // 닉네임 수정 상태
  const [newNickname, setNewNickname] = useState(""); // 새로운 닉네임 상태
  const [selectedFile, setSelectedFile] = useState(null); // 선택된 파일 상태

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          alert("로그인이 필요합니다.");
          return;
        }

        // 사용자 정보 가져오기
        const response = await axios.get("http://localhost:8080/api/users/mypage", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const username = response.data.username;
        setUserData((prevData) => ({ ...prevData, ...response.data }));
        setNewNickname(response.data.nickname); // 기존 닉네임을 상태로 설정

        // 게시글 데이터 요청 및 필터링
        const res = await axios.get("http://localhost:8080/api/public/donations/all");
        const filteredPosts = res.data.data
          .filter((post) => post.username === username) // username으로 필터링
          .map((post) => ({
            id: post.id,
            postNumber: post.donationType,
            image: post.mainImage,
            title: post.title,
            subtitle: post.subtitle,
            goalAmount: post.goalAmount,
            currentAmount: post.collectedAmount,
          }));

        setUserData((prevData) => ({ ...prevData, posts: filteredPosts }));
      } catch (error) {
        console.error("데이터 로드 실패:", error);
        alert("데이터를 가져오는 중 오류가 발생했습니다.");
      }
    };

    fetchData();
  }, []);

  const handleCharge = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("로그인이 필요합니다.");
        return;
      }

      if (!getMoney || getMoney <= 0) {
        alert("충전할 금액을 올바르게 입력하세요.");
        return;
      }

      const response = await axios.post(
        "http://localhost:8080/api/users/addbalance",
        { amount: parseFloat(getMoney) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(response.data.message);
      setGetMoney("");

      // 사용자 정보 다시 로드
      const userResponse = await axios.get("http://localhost:8080/api/users/mypage", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserData((prevData) => ({ ...prevData, ...userResponse.data }));
    } catch (error) {
      console.error("충전 요청 실패:", error);
      alert("충전 요청에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleNicknameUpdate = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!newNickname.trim()) {
        alert("닉네임을 입력해주세요.");
        return;
      }

      const response = await axios.patch(
        "http://localhost:8080/api/users/update",
        { nickname: newNickname },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(response.data.message);
      setUserData((prevData) => ({ ...prevData, nickname: newNickname }));
      setEditingNickname(false); // 수정 상태 종료
    } catch (error) {
      console.error("닉네임 수정 실패:", error);
      alert("닉네임 수정 요청에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleFileUpload = async () => {
    try {
      if (!selectedFile) {
        alert("파일을 선택해주세요.");
        return;
      }

      const formData = new FormData();
      formData.append("file", selectedFile);

      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:8080/api/users/uploadProfile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert(response.data.message);
      setUserData((prevData) => ({
        ...prevData,
        profileImage: response.data.profileImageUrl,
      }));
    } catch (error) {
      console.error("파일 업로드 실패:", error);
      alert("파일 업로드에 실패했습니다.");
    }
  };

  return (
    <div className="mypagedetail-container">
      {/* 프로필 박스 */}
      <div className="profileBox">
        <div className="inner-box">
          <img
            className="profileimage"
            src={userData.profileImage || "/defaultprofile.png"}
            alt="Default Profile"
          />
          <div className="namebox">
            {editingNickname ? (
              <>
                <input
                  type="text"
                  value={newNickname}
                  onChange={(e) => setNewNickname(e.target.value)}
                  placeholder="새 닉네임 입력"
                  className="nickname-input"
                />
                <button onClick={handleNicknameUpdate} className="save-button">
                  저장
                </button>
                <button onClick={() => setEditingNickname(false)} className="cancel-button">
                  취소
                </button>
              </>
            ) : (
              <>
                <h2 className="Name">{userData.nickname || "로딩 중..."}</h2>
                <button onClick={() => setEditingNickname(true)} className="edit-button">
                  닉네임 수정
                </button>
              </>
            )}
          </div>
        </div>
        <div className="change-box">
          <h2>파일 박스</h2>
          <input type="file" onChange={handleFileChange} />
          <button onClick={handleFileUpload} className="file-upload-button">
            업로드
          </button>
        </div>
        <div className="inner-box2">
          <div className="nowmoeny">
            <h2>
              현재 잔고: {userData.balance !== undefined ? `${userData.balance} 원` : "로딩 중..."}
            </h2>
          </div>
          <div className="charge-container">
            <input
              id="getmoney"
              type="number"
              value={getMoney}
              onChange={(e) => setGetMoney(e.target.value)}
              placeholder="금액 입력"
              className="charge-input"
            />
            <button onClick={handleCharge} className="charge-button">
              충전
            </button>
          </div>
        </div>
        <div className="all-donation-post">
          <div className="posts-container">
            {userData.posts.length > 0 ? (
              userData.posts.map((post) => (
                <PostCard
                  key={post.id}
                  id={post.id}
                  postNumber={post.postNumber}
                  image={post.image}
                  title={post.title}
                  subtitle={post.subtitle}
                  goalAmount={post.goalAmount}
                  currentAmount={post.currentAmount}
                />
              ))
            ) : (
              <p>등록한 게시물이 없습니다.</p>
            )}
          </div>
        </div>
      </div>
      <div className="mypage-container">
        <MyPage />
      </div>
    </div>
  );
}

export default Mypagedetail;
