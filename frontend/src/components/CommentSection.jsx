import React, { useState } from 'react';
import { Send, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const CommentSection = ({ comments = [], onAddComment, loading }) => {
  const [text, setText] = useState('');
  const { user } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onAddComment(text.trim());
      setText('');
    }
  };

  return (
    <div style={{ marginTop: '1rem', borderTop: '1px solid #e5e7eb', paddingTop: '1rem' }}>
      <h5 style={{ fontSize: '0.9rem', color: '#064e3b', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <MessageSquare size={16} color="#059669" /> Comments ({comments.length})
      </h5>

      {/* Comment Input */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
        <img
          src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
          alt={user?.name || 'User'}
          style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
        />
        <input
          type="text"
          className="form-control"
          placeholder="Share your thoughts or answer questions..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ borderRadius: '9999px', fontSize: '0.85rem' }}
        />
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading || !text.trim()}
          style={{ borderRadius: '9999px', padding: '0.5rem 0.85rem' }}
        >
          <Send size={14} />
        </button>
      </form>

      {/* List of Comments */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {comments.map((comment, idx) => {
          const author = comment.userId || {};
          return (
            <div
              key={comment._id || idx}
              style={{
                display: 'flex',
                gap: '10px',
                background: '#f9fafb',
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                border: '1px solid #f3f4f6',
              }}
            >
              <img
                src={author.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={author.name || 'Gardener'}
                style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#064e3b' }}>
                    {author.name || 'Anonymous Gardener'}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: '#9ca3af' }}>
                    {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : ''}
                  </span>
                </div>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#374151', lineHeight: 1.4 }}>
                  {comment.text}
                </p>
              </div>
            </div>
          );
        })}

        {comments.length === 0 && (
          <p style={{ fontSize: '0.8rem', color: '#9ca3af', fontStyle: 'italic', margin: 0 }}>
            No comments yet. Be the first to start the discussion!
          </p>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
