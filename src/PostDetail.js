// src/PostDetail.js
import React from 'react';

function PostDetail({ post }) {
  return (
    <div>
      <h3>{post.title}</h3>
      <p>{post.content}</p>
    </div>
  );
}

export default PostDetail;
