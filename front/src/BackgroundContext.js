import React, { createContext, useContext, useState } from 'react';
import './BackgroundContext.css'; // CSS 파일 가져오기

const BackgroundContext = createContext();

export const BackgroundProvider = ({ children }) => {
  const [backgroundImage, setBackgroundImage] = useState('https://vrthumb.imagetoday.co.kr/2021/05/13/twi001t3391317.jpg');

  return (
    <BackgroundContext.Provider value={{ backgroundImage, setBackgroundImage }}>
      <div
        className="background-container"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      >
        {children}
      </div>
    </BackgroundContext.Provider>
  );
};

export const useBackground = () => useContext(BackgroundContext);
