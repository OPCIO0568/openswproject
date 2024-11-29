import React, { useState, useEffect } from "react";
import "./Board.css";

function Board() {
  const banners = [
    { id: 1, imageUrl: "https://static.wanted.co.kr/images/events/3066/5391ccc8.jpg", description: "자연과 함께하는 삶" },
    { id: 2, imageUrl: "https://plus.unsplash.com/premium_photo-1661517335128-2bcf290d58f6?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8JUVEJThDJTgwJUVDJTlCJThEJTIwJUVEJTk4JTkxJUVDJTk3JTg1fGVufDB8fDB8fHww", description: "최신 기술 트렌드" },
    { id: 3, imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkDxCs2SY4KRfy_YqZzsBJP2M6duiYcflrXQ&s", description: "미래의 혁신" },
  ];

  const circles = [
    { id: 1, imageUrl: "https://cdn-icons-png.flaticon.com/512/5017/5017478.png", alt: "첫 번째 그림" },
    { id: 2, imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNlFv2ex9xpV-wSKGwrz8DlwQuFFXYs3XHwiuPvzp_Z01epfMGJNaULHe76q3b57z-ug8&usqp=CAU", alt: "두 번째 그림" },
    { id: 3, imageUrl: "https://png.pngtree.com/png-clipart/20190902/original/pngtree-red-fund-stock-market-rising-curve-png-image_4399401.jpg", alt: "세 번째 그림" },
  ];

  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [isTextVisible, setIsTextVisible] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTextVisible(false); // 문구를 숨김
      setTimeout(() => {
        setCurrentBannerIndex((prevIndex) => (prevIndex + 1) % banners.length); // 슬라이드 변경
        setTimeout(() => setIsTextVisible(true), 1200); // 슬라이드 변경 후 문구를 나타냄
      }, 1000); // 문구 숨긴 뒤 슬라이드 전환
    }, 5000); // 전체 슬라이드 주기
    return () => clearInterval(interval);
  }, [banners.length]);

  // 원형 도형 클릭 이벤트 핸들러
  const handleCircleClick = (id) => {
    console.log(`Circle with ID ${id} clicked`);
    // 원하는 동작을 여기에 추가함
  };

  return (
    <>
      <div className="board-container">
        <div className="carousel-container">
          <div
            className="carousel"
            style={{
              transform: `translateX(-${currentBannerIndex * 100}%)`,
            }}
          >
            {banners.map((banner, index) => (
              <div key={banner.id} className="carousel-slide">
                <img src={banner.imageUrl} alt={`Banner ${banner.id}`} className="carousel-image" />
                <div
                  className={`banner-description ${
                    index === currentBannerIndex && isTextVisible ? "visible" : "hidden"
                  }`}
                >
                  {banner.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 원형 도형 영역 */}
      <div className="circle-container">
        {circles.map((circle) => (
          <div
            key={circle.id}
            className="circle"
            onClick={() => handleCircleClick(circle.id)}
          >
            <img
              src={circle.imageUrl}
              alt={circle.alt}
              className="circle-image"
            />
          </div>
        ))}
      </div>

    </>

  );
}

export default Board;
