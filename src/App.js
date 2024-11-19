import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Header from './Header';
import Board from './Board';
import Footer from './Footer';
import AllDonationPost from './AllDonationPost';
import MyPage from './MyPage';
import './App.css';
import Mypagedetail from './Mypagedetail';
import LoginPage from './LoginPage';



function App() {
  return (
    <Router>
      <div className="App">
        <Header />

        {/* ��ο� ���� ������ ������ */}
        <Routes>
          <Route path="/" element={<Board />} /> {/* �⺻ Ȩ ������ */}
          <Route path="/AllDonationPost" element={<AllDonationPost />} />
          <Route path="/MyPage" element={<MyPage />} />
          <Route path="/Mypagedetail" element={<Mypagedetail />} />
          <Route path="/login" element={<LoginPage />} />

        </Routes>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;
