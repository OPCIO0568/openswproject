import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Header';
import Board from './Board';
import AllDonationPost from './AllDonationPost';
import MyPage from './MyPage';
import './App.css';
import Mypagedetail from './Mypagedetail';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import CreatePostPage from './CreatePostPage';
import PostDetail from './PostDetail';
import PrivateRoute from './PrivateRoute';
import Introduce from './Introduce';
import Review from './Review';
import ReviewDetail from './ReviewDetail';
import { AuthProvider } from './AuthContext'; // AuthProvider 사용
import { BackgroundProvider } from './BackgroundContext';


function App() {
  return (
    <AuthProvider>
      <BackgroundProvider>
        <Router>
          <div className="App" style={{ display: 'flex', height: '100vh' }}>
            {/* 메인 컨텐츠 */}
            <div style={{ flex: 4, display: 'flex', flexDirection: 'column' }}>
              <Header />
              <Routes>
                <Route path="/" element={<Board />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/AllDonationPost" element={<AllDonationPost />} />
                <Route
                  path="/MyPage"
                  element={
                    <PrivateRoute>
                      <MyPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/Mypagedetail"
                  element={
                    <PrivateRoute>
                      <Mypagedetail />
                    </PrivateRoute>
                  }
                />
                <Route path="/AllDonationPost/CreatePostPage" element={<CreatePostPage />} />
                <Route path="/AllDonationPost/PostDetail/:postId" element={<PostDetail />} />
                <Route path="/CreatePostPage" element={<CreatePostPage />} />
                <Route path="/Introduce" element={<Introduce />} />
                <Route path="/Review" element={<Review />} />
                <Route path="/ReviewDetail/:reviewId" element={<ReviewDetail />} />

                
              </Routes>
            </div>

          </div>
        </Router>
      </BackgroundProvider>

    </AuthProvider>
  );
}

export default App;
