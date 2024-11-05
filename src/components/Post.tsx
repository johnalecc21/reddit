import React, { useState } from 'react';
import { ArrowBigDown, ArrowBigUp, MessageSquare, Share, BookmarkPlus, Flag } from 'lucide-react';
import type { Post, Comment } from '../types';
import Comments from './Comments';

interface PostProps {
  post: Post;
}

export default function Post({ post: initialPost }: PostProps) {
  const [post, setPost] = useState(initialPost);

  const handleCommentAdded = (newComment: Comment) => {
    setPost(prevPost => ({
      ...prevPost,
      comments: [...prevPost.comments, newComment]
    }));
  };

  return (
    <div className="bg-white rounded-md shadow">
      {/* Vote sidebar */}
      <div className="flex">
        <div className="w-10 bg-gray-50 p-2 flex flex-col items-center rounded-l-md">
          <button className="text-gray-400 hover:text-orange-500">
            <ArrowBigUp className="w-6 h-6" />
          </button>
          <span className="font-bold text-sm my-1">{post.votes}</span>
          <button className="text-gray-400 hover:text-blue-500">
            <ArrowBigDown className="w-6 h-6" />
          </button>
        </div>

        {/* Main content */}
        <div className="flex-1 p-2">
          {/* Post header */}
          <div className="text-xs text-gray-500 mb-2">
            <span className="font-bold text-black">r/{post.subreddit}</span>
            <span className="mx-1">•</span>
            Posted by u/{post.author}
            <span className="mx-1">•</span>
            {post.timestamp}
          </div>

          {/* Post title */}
          <h2 className="text-xl font-bold mb-4">{post.title}</h2>

          {/* Post content */}
          <div className="text-sm mb-4">{post.content}</div>

          {/* Action buttons */}
          <div className="flex gap-4 text-gray-500 text-sm">
            <button className="flex items-center gap-1 hover:bg-gray-100 p-2 rounded">
              <MessageSquare className="w-4 h-4" />
              {post.comments.length} Comments
            </button>
            <button className="flex items-center gap-1 hover:bg-gray-100 p-2 rounded">
              <Share className="w-4 h-4" />
              Share
            </button>
            <button className="flex items-center gap-1 hover:bg-gray-100 p-2 rounded">
              <BookmarkPlus className="w-4 h-4" />
              Save
            </button>
            <button className="flex items-center gap-1 hover:bg-gray-100 p-2 rounded">
              <Flag className="w-4 h-4" />
              Report
            </button>
          </div>
        </div>
      </div>

      {/* Comments section */}
      <Comments 
        postId={post.id} 
        comments={post.comments} 
        onCommentAdded={handleCommentAdded} 
      />
    </div>
  );
}