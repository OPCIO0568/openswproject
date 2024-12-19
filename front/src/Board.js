import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate 가져오기
import axios from "axios"; // axios 임포트
import "./Board.css";

function Board() {
  const navigate = useNavigate(); // useNavigate 초기화

  const banners = [
    {
      id: 1,
      imageUrl: "https://cdn.digitaltoday.co.kr/news/photo/202307/481900_449732_412.jpg",
      description: "혁신의 새로운 정의, 비전프로를 통해 경험하다",
      path: "/AllDonationPost/PostDetail/21"
    },
    {
      id: 2,
      imageUrl: "https://www.globalnewsagency.kr/news/photo/202209/269741_273679_3434.jpg",
      description: "기근의 사슬을 끊다 - 아프리카 아이들에게 희망의 밥상을",
      path: "/AllDonationPost/PostDetail/2"
    },
    {
      id: 3,
      imageUrl: "https://static.wanted.co.kr/images/events/3066/5391ccc8.jpg",
      description: "20대 창업가의 날개를 펼치다 - 세상을 바꾸는 작은 시작",
      path: "/AllDonationPost/PostDetail/3"
    }
  ];

  // 각 원형 그림에 donationType 추가
  const circles = [
    { id: 1, imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-qS8z_03OdrI3n8fUdynIoXjw1vjkfPyvtQ&s", alt: "첫 번째 그림", path: "/AllDonationPost", donationType: 1 },
    { id: 2, imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhwW6PbwRrHnDSnz1Iu0APlXH8XuJrODaPQw&s", alt: "두 번째 그림", path: "/AllDonationPost", donationType: 2 },
    { id: 3, imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsQ4nBF3KQh5dcvU33JzxnSGrABdbDzgJ-ww&s", alt: "세 번째 그림", path: "/AllDonationPost", donationType: 3 },
  ];

  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [isTextVisible, setIsTextVisible] = useState(true);

  // 랭킹 데이터 상태 추가
  const [rankingPosts, setRankingPosts] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTextVisible(false);
      setTimeout(() => {
        setCurrentBannerIndex((prevIndex) => (prevIndex + 1) % banners.length);
        setTimeout(() => setIsTextVisible(true), 1000);
      }, 1000);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  // handleCircleClick 함수 수정
  const handleCircleClick = (circle) => {
    navigate(circle.path, { state: { donationType: circle.donationType } }); // donationType 전달
  };

  const handleBannerClick = (path) => {
    navigate(path); // 배너 클릭 시 경로 이동
  };

  // 랭킹 데이터를 가져오는 useEffect 추가
  useEffect(() => {
    // GET 요청으로 게시글 데이터 가져오기
    axios
      .get("http://localhost:8080/api/public/donations/all", {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        // 데이터의 data 속성에서 게시글 리스트를 가져옴
        const fetchedPosts = response.data.data
          .sort((a, b) => b.LikeCount - a.LikeCount) // LikeCount로 내림차순 정렬
          .slice(0, 4); // 상위 5개만 선택

        setRankingPosts(fetchedPosts);
      })
      .catch((error) => {
        console.error("데이터 가져오기 실패:", error);
      });
  }, []);

  // 랭킹 아이템 클릭 시 상세 페이지로 이동하는 함수
  const handleRankingClick = (id) => {
    if (!id) {
      console.error("Post ID is undefined.");
      return;
    }
    navigate(`/AllDonationPost/PostDetail/${id}`); // Navigate to the correct URL
  };

  return (
    <div className="board-container">
      <div className="Main-Page-Pic">
        <img src="/ggg.webp" alt="메인 사진" className="mainpic" />
        <div className="main-text">
          <h1></h1>
        </div>
      </div>
      
      {/* 상단 원형 그림 */}
      <div className="circle-container">
        {circles.map((circle) => (
          <div
            key={circle.id}
            className="circle"
            onClick={() => handleCircleClick(circle)}
          >
            <img src={circle.imageUrl} alt={circle.alt} className="circle-image" />
          </div>
        ))}
      </div>
      
      {/* 새로운 circlename-container */}
      <div className="circlename-container">
        <p className="circle-name">기부</p>
        <p className="circle-name">스타트업</p>
        <p className="circle-name">펀딩</p>
      </div>
      
      {/* 하단 슬라이드 및 빈 공간 */}
      <div className="content-container">
        {/* 왼쪽 슬라이드 */}
        <div className="carousel-container">
          <div
            className="carousel"
            style={{
              transform: `translateX(-${currentBannerIndex * 100}%)`,
            }}
          >
            {banners.map((banner) => (
              <div
                key={banner.id}
                className="carousel-slide"
                onClick={() => handleBannerClick(banner.path)} // 배너 클릭 시 이동
                style={{ cursor: "pointer" }} // 클릭 가능한 스타일 추가
              >
                <img
                  src={banner.imageUrl}
                  alt={`Banner ${banner.id}`}
                  className="carousel-image"
                />
                <div
                  className={`banner-description ${
                    isTextVisible ? "visible" : "hidden"
                  }`}
                >
                  {banner.description}
                </div>
              </div>
            ))}
          </div>
        </div>
  
        {/* 오른쪽 랭킹 박스 */}
        <div className="empty-box">
          <h2 className="Ranking">좋아요 랭킹</h2>
          <div className="Rankbox">
            {rankingPosts.map((post, index) => (
              <div
                key={post.id}
                className="RankItem"
                onClick={() => handleRankingClick(post.id)}
                style={{ cursor: "pointer" }}
              >
                <h3 className="RankNumber">{index + 1}</h3>
                <h3 className="PostTitle">{post.title}</h3>
                <h3 className="PostLike"> 👍 : {post.LikeCount} </h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Board;
