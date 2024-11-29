import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Header from './Header';
import Board from './Board';
import Footer from './Footer';
import AllDonationPost from './AllDonationPost';
import MyPage from './MyPage';
import './App.css';
import Mypagedetail from './Mypagedetail';
import LoginPage from './LoginPage';
import CreatePostPage from './CreatePostPage';
import PostDetail from './PostDetail';



function App() {
  return (
    <Router>
      <div className="App">
        <Header />

        
        <Routes>
          <Route path="/" element={<Board />} /> 
          <Route path="/AllDonationPost" element={<AllDonationPost />} />
          <Route path="/MyPage" element={<MyPage />} />
          <Route path="/Mypagedetail" element={<Mypagedetail />} />
          <Route path="/login" element={<LoginPage />} />
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
