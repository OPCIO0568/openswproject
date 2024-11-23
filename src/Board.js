import React from 'react';
import { useNavigate } from 'react-router-dom'; // React Router의 useNavigate 가져오기
import MyPage from './MyPage';

function Board() {
  const navigate = useNavigate(); // useNavigate 훅 초기화

  const circles = [
    { id: 1, imageUrl: 'https://cdn-icons-png.flaticon.com/512/5017/5017478.png', alt: '첫 번째 그림' },
    { id: 2, imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNlFv2ex9xpV-wSKGwrz8DlwQuFFXYs3XHwiuPvzp_Z01epfMGJNaULHe76q3b57z-ug8&usqp=CAU', alt: '두 번째 그림' },
    { id: 3, imageUrl: 'https://png.pngtree.com/png-clipart/20190902/original/pngtree-red-fund-stock-market-rising-curve-png-image_4399401.jpg', alt: '세 번째 그림' },
  ];

  const handleCircleClick = (id) => {
    if (id === 1) {
      navigate('/AllDonationPost'); // id가 1일 때 AllDonationPost로 이동
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px' }}>
      {/* 원형 도형들 */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'space-around' }}>
        {circles.map((circle) => (
          <div
            key={circle.id}
            style={{
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f0f0f0',
              cursor: 'pointer', // 클릭 가능한 포인터 스타일
            }}
            onClick={() => handleCircleClick(circle.id)} // 클릭 이벤트 핸들러 추가
          >
            <img
              src={circle.imageUrl}
              alt={circle.alt}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        ))}
      </div>

      {/* 오른쪽에 마이페이지 컴포넌트를 불러오기 */}
      <MyPage />
    </div>
  );
}

export default Board;
