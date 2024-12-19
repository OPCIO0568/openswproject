import React, { useState, useEffect } from "react";
import MyPage from "./MyPage";
import "./Mypagedetail.css";
import PostCard from "./PostCard";
import "./PostCard.css";
import axios from "axios";

function Mypagedetail() {
  const [userData, setUserData] = useState({ posts: [] }); 
  const [getMoney, setGetMoney] = useState(""); 
  const [selectedFile, setSelectedFile] = useState(null); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          alert("로그인이 필요합니다.");
          return;
        }

        const response = await axios.get("http://localhost:8080/api/users/mypage", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const username = response.data.username;
        setUserData((prevData) => ({ ...prevData, ...response.data }));

        const res = await axios.get("http://localhost:8080/api/public/donations/all");
        const filteredPosts = res.data.data
          .filter((post) => post.username === username)
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

      const userResponse = await axios.get("http://localhost:8080/api/users/mypage", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserData((prevData) => ({ ...prevData, ...userResponse.data }));
      window.open(
        'https://new-m.pay.naver.com/pay-point-convert-in/pointconvert?backType=CLOSE',
        '_blank'
      );
    } catch (error) {
      console.error("충전 요청 실패:", error);
      alert("충전 요청에 실패했습니다. 다시 시도해주세요.");
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
        "http://localhost:8080/api/users/uploadProfileImage",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`, 
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true, 
        }
      );

      const { status, message, imagePath } = response.data;

      if (status === "success") {
        alert(message);

        setUserData((prevData) => ({
          ...prevData,
          profilepath: imagePath,
        }));

        setSelectedFile(null);
      }
    } catch (error) {
      console.error("파일 업로드 실패:", error);
      alert("프로필 이미지 업로드에 실패했습니다.");
    }
  };

  return (
    <div className="mypagedetail-container">
      <div className="profileBox">
        <div className="inner-box">
          <img
            className="profileimage"
            src={userData.profilepath || "/defaultprofile.png"}
            alt="프로필 이미지"
          />
          <div className="namebox">
            <h2 className="Name">{userData.nickname +" 님 안녕하세요!"|| "로딩 중..."}</h2>
          </div>
        </div>

        <div className="change-box">
          <h2>프로필 사진</h2>
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
