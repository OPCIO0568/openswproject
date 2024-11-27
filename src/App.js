import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Header';
import Board from './Board';
import Footer from './Footer';
import AllDonationPost from './AllDonationPost';
import MyPage from './MyPage';
import './App.css';
import Mypagedetail from './Mypagedetail';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import CreatePostPage from './CreatePostPage';
import PostDetail from './PostDetail';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태
  const [username, setUsername] = useState(''); // 닉네임 저장

  const handleLogin = (user) => {
    setIsLoggedIn(true);
    setUsername(user.username); // 닉네임 설정
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
  };

    return (
      <Router>
        <div className="App">
        <Header 
            isLoggedIn={isLoggedIn} 
            username={username} 
            onLogout={handleLogout} 
          />
          <Routes>
            <Route path="/" element={<Board />} /> 
            <Route path="/AllDonationPost" element={<AllDonationPost />} />
            <Route path="/MyPage" element={<MyPage />} />
            <Route path="/Mypagedetail" element={<Mypagedetail />} />
            <Route 
              path="/login" 
              element={<LoginPage onLogin={handleLogin} />} 
            />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/AllDonationPost/CreatePostPage" element={<CreatePostPage />} />
            <Route path="/AllDonationPost/PostDetail" element={<PostDetail />} />
            <Route path="/AllDonationPost/PostDetail/:postId" element={<PostDetail />} />
  
  
          </Routes>
          
          <Footer />
        </div>
      </Router>
    );
  }
  
  export default App;
  