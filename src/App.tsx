import React, { useState } from 'react';
import Post from './components/Post';
import Sidebar from './components/Sidebar';
import type { Post as PostType, Rule } from './types';

function App() {
  const [language, setLanguage] = useState<'en' | 'es'>('en');

  const mockPost: PostType = {
    id: '1',
    title: 'Whats a small act of kindness you were once shown, that youll never forget?',
    author: 'username123',
    content: 'Im curious to hear about small acts of kindness that have stuck with you over the years. Sometimes the smallest gestures can have the biggest impact.',
    timestamp: '5 hours ago',
    votes: 15200,
    subreddit: 'AskReddit',
    comments: [
      {
        id: 'c1',
        author: 'commenter1',
        content: 'When I was broke in college, a stranger paid for my groceries when my card got declined. It was only about $30 worth but Ill never forget that.',
        timestamp: '4 hours ago',
        votes: 523,
        replies: []
      }
    ]
  };

  const rules: Rule[] = [
    {
      id: 1,
      title: language === 'en' ? 'Be respectful' : 'Sé respetuoso',
      description: language === 'en' 
        ? 'Treat others with respect and follow Reddiquette'
        : 'Trata a los demás con respeto y sigue la Reddiquette'
    },
    {
      id: 2,
      title: language === 'en' ? 'No personal information' : 'Sin información personal',
      description: language === 'en'
        ? 'Do not share personal or confidential information'
        : 'No compartas información personal o confidencial'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-5xl mx-auto py-8 px-4">
        <div className="flex gap-6">
          {/* Main content */}
          <div className="flex-1">
            <Post post={mockPost} />
          </div>

          {/* Sidebar */}
          <div className="w-80 hidden md:block">
            <div className="sticky top-4">
              <div className="mb-4">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as 'en' | 'es')}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                </select>
              </div>
              <Sidebar rules={rules} language={language} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;