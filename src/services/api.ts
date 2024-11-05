import type { Comment, Post } from '../types';

const API_URL = 'http://localhost:8000/api';

export async function addComment(postId: string, content: string): Promise<Comment> {
  const response = await fetch(`${API_URL}/posts/${postId}/comments/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to add comment');
  }
  
  return response.json();
}

export async function addReply(postId: string, commentId: string, content: string): Promise<Comment> {
  const response = await fetch(`${API_URL}/posts/${postId}/comments/${commentId}/replies/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to add reply');
  }
  
  return response.json();
}