export interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  votes: number;
  replies: Comment[];
}

export interface Post {
  id: string;
  title: string;
  author: string;
  content: string;
  timestamp: string;
  votes: number;
  comments: Comment[];
  subreddit: string;
}

export interface Rule {
  id: number;
  title: string;
  description: string;
}