import React, { createContext, useContext, useState } from 'react';

const BackgroundContext = createContext();

export const BackgroundProvider = ({ children }) => {
  const [backgroundImage, setBackgroundImage] = useState('https://vrthumb.imagetoday.co.kr/2021/05/13/twi001t3391317.jpg'); // 기본 배경 이미지

  return (
    <BackgroundContext.Provider value={{ backgroundImage, setBackgroundImage }}>
      <div
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '100vh', // 화면 전체 채우기
          margin: 0,
        }}
      >
        {children}
      </div>
    </BackgroundContext.Provider>
  );
};

export const useBackground = () => useContext(BackgroundContext);
