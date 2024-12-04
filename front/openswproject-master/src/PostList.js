// src/PostList.js
import React from 'react';

function PostList({ onSelectPost }) {
  // 예제 게시글 데이터
  const posts = [
    { id: 1, title: '첫 번째 게시글', content: '이것은 첫 번째 게시글의 내용입니다.' },
    { id: 2, title: '두 번째 게시글', content: '이것은 두 번째 게시글의 내용입니다.' },
    { id: 3, title: '세 번째 게시글', content: '이것은 세 번째 게시글의 내용입니다.' },
  ];

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id} onClick={() => onSelectPost(post)} style={{ cursor: 'pointer', padding: '10px 0' }}>
          {post.title}
        </li>
      ))}
    </ul>
  );
}

export default PostList;
