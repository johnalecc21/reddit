import React, { useState } from 'react';
import { 
  MessageSquare, 
  Bold, 
  Italic, 
  Link2, 
  List, 
  Quote, 
  Code, 
  Strikethrough,
  Image,
  Superscript,
  Table,
  HelpCircle
} from 'lucide-react';
import type { Comment } from '../types';
import { addComment, addReply } from '../services/api';

interface CommentsProps {
  postId: string;
  comments: Comment[];
  onCommentAdded: (comment: Comment) => void;
}

interface FormatButton {
  icon: React.ReactNode;
  label: string;
  action: (text: string) => string;
}

export default function Comments({ postId, comments, onCommentAdded }: CommentsProps) {
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [textareaRef, setTextareaRef] = useState<HTMLTextAreaElement | null>(null);
  const [showFormatHelp, setShowFormatHelp] = useState(false);

  const formatButtons: FormatButton[] = [
    {
      icon: <Bold className="w-4 h-4" />,
      label: 'Bold',
      action: (text) => `**${text}**`
    },
    {
      icon: <Italic className="w-4 h-4" />,
      label: 'Italic',
      action: (text) => `*${text}*`
    },
    {
      icon: <Strikethrough className="w-4 h-4" />,
      label: 'Strikethrough',
      action: (text) => `~~${text}~~`
    },
    {
      icon: <Code className="w-4 h-4" />,
      label: 'Code',
      action: (text) => `\`${text}\``
    },
    {
      icon: <Superscript className="w-4 h-4" />,
      label: 'Superscript',
      action: (text) => `^(${text})`
    },
    {
      icon: <Link2 className="w-4 h-4" />,
      label: 'Link',
      action: (text) => `[${text}](url)`
    },
    {
      icon: <List className="w-4 h-4" />,
      label: 'Bulleted List',
      action: (text) => `* ${text}`
    },
    {
      icon: <Quote className="w-4 h-4" />,
      label: 'Quote',
      action: (text) => `> ${text}`
    },
    {
      icon: <Table className="w-4 h-4" />,
      label: 'Table',
      action: () => `Header 1 | Header 2\n---|---\nCell 1 | Cell 2`
    },
    {
      icon: <Image className="w-4 h-4" />,
      label: 'Image',
      action: (text) => `![${text}](url)`
    }
  ];

  const handleFormat = (formatAction: (text: string) => string) => {
    if (!textareaRef) return;

    const start = textareaRef.selectionStart;
    const end = textareaRef.selectionEnd;
    const selectedText = newComment.substring(start, end);
    const formattedText = formatAction(selectedText || 'text');
    
    const newValue = newComment.substring(0, start) + formattedText + newComment.substring(end);
    setNewComment(newValue);
    
    setTimeout(() => {
      textareaRef.focus();
      textareaRef.setSelectionRange(
        start + formattedText.length,
        start + formattedText.length
      );
    }, 0);
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const comment = await addComment(postId, newComment);
      onCommentAdded(comment);
      setNewComment('');
    } catch (err) {
      setError('Failed to add comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitReply = async (commentId: string) => {
    if (!replyContent.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const reply = await addReply(postId, commentId, replyContent);
      onCommentAdded(reply);
      setReplyContent('');
      setReplyingTo(null);
    } catch (err) {
      setError('Failed to add reply. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const CommentComponent = ({ comment }: { comment: Comment }) => (
    <div className="border-l-2 border-gray-200 pl-4 mb-4">
      <div className="text-xs text-gray-500 mb-1">
        <span className="font-bold text-gray-700">{comment.author}</span>
        <span className="mx-1">•</span>
        {comment.timestamp}
      </div>
      <div className="text-sm mb-2">{comment.content}</div>
      <div className="flex gap-2 text-xs text-gray-500">
        <button 
          onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
          className="hover:text-blue-500"
        >
          Reply
        </button>
        <button className="hover:text-blue-500">Share</button>
        <button className="hover:text-blue-500">Report</button>
      </div>

      {replyingTo === comment.id && (
        <div className="mt-4">
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Write your reply..."
            className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
          <div className="mt-2 flex gap-2">
            <button
              onClick={() => handleSubmitReply(comment.id)}
              disabled={isSubmitting}
              className="px-3 py-1 bg-blue-500 text-white text-xs rounded-full font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Reply'}
            </button>
            <button
              onClick={() => {
                setReplyingTo(null);
                setReplyContent('');
              }}
              className="px-3 py-1 text-xs text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {comment.replies.map((reply) => (
        <div key={reply.id} className="mt-4">
          <CommentComponent comment={reply} />
        </div>
      ))}
    </div>
  );

  return (
    <div className="border-t border-gray-200 p-4">
      <form onSubmit={handleSubmitComment} className="mb-6">
        <textarea
          ref={setTextareaRef}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="What are your thoughts?"
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
          rows={4}
        />

        {/* Bottom Toolbar */}
        <div className="flex flex-col border border-gray-200 rounded-md">
          {/* Formatting buttons */}
          <div className="flex flex-wrap gap-1 p-2 border-b border-gray-200">
            {formatButtons.map((button, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleFormat(button.action)}
                className="p-1.5 hover:bg-gray-100 rounded-md text-gray-600 hover:text-gray-800 transition-colors"
                title={button.label}
              >
                {button.icon}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setShowFormatHelp(!showFormatHelp)}
              className="p-1.5 hover:bg-gray-100 rounded-md text-gray-600 hover:text-gray-800 transition-colors ml-auto"
              title="Formatting Help"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>

          {/* Formatting help */}
          {showFormatHelp && (
            <div className="p-3 bg-gray-50 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-bold mb-2">Text Formatting</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li><code>**bold**</code> for <strong>bold</strong></li>
                    <li><code>*italic*</code> for <em>italic</em></li>
                    <li><code>~~strikethrough~~</code></li>
                    <li><code>`code`</code> for inline code</li>
                    <li><code>^(superscript)</code></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold mb-2">Content Formatting</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li><code>[text](url)</code> for links</li>
                    <li><code>* item</code> for bullet points</li>
                    <li><code>&gt; quote</code> for quotes</li>
                    <li><code>![alt](url)</code> for images</li>
                    <li>Click table icon for tables</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {error && (
          <p className="mt-2 text-sm text-red-500">{error}</p>
        )}

        <div className="mt-2 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-500 text-white rounded-full text-sm font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Comment'}
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {comments.map((comment) => (
          <CommentComponent key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
}