import React, { useState } from 'react';
import { Heart, MessageSquare, Tag, Trash2, Share2 } from 'lucide-react';
import CommentSection from './CommentSection';
import { useAuth } from '../context/AuthContext';

const PostCard = ({ post, onLike, onAddComment, onDelete }) => {
  const [showComments, setShowComments] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const { user } = useAuth();

  if (!post) return null;

  const author = post.userId || {};
  const isOwner = user && (user.id === author._id || user._id === author._id);
  const isLiked = user && post.likes?.some((id) => id === user.id || id === user._id || id._id === user.id);

  const handleAddComment = async (text) => {
    setCommentLoading(true);
    try {
      if (onAddComment) await onAddComment(post._id, text);
    } finally {
      setCommentLoading(false);
    }
  };

  return (
    <div className="card" style={{ marginBottom: '1.5rem', padding: '1.5rem' }}>
      {/* Author Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img
            src={author.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
            alt={author.name || 'Author'}
            style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #a7f3d0' }}
          />
          <div>
            <h4 style={{ margin: 0, fontSize: '0.975rem', color: '#064e3b', fontWeight: 700 }}>
              {author.name || 'Gardener'}
            </h4>
            <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
              {post.createdAt ? new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recently'}
            </span>
          </div>
        </div>

        {isOwner && onDelete && (
          <button
            onClick={() => onDelete(post._id)}
            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
            title="Delete post"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>

      {/* Post Title & Content */}
      {post.title && (
        <h3 style={{ fontSize: '1.15rem', color: '#064e3b', margin: '0 0 8px 0', fontWeight: 700 }}>
          {post.title}
        </h3>
      )}

      <p style={{ fontSize: '0.925rem', color: '#374151', lineHeight: 1.6, margin: '0 0 1rem 0', whiteSpace: 'pre-line' }}>
        {post.content}
      </p>

      {/* Post Photo if uploaded */}
      {post.imageUrl && (
        <div style={{ borderRadius: '14px', overflow: 'hidden', marginBottom: '1rem', maxHeight: '400px' }}>
          <img
            src={post.imageUrl}
            alt="Community post attachment"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      )}

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '1rem' }}>
          {post.tags.map((tag, i) => (
            <span
              key={i}
              style={{
                background: '#ecfdf5',
                color: '#047857',
                fontSize: '0.75rem',
                fontWeight: 600,
                padding: '3px 8px',
                borderRadius: '9999px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
              }}
            >
              <Tag size={12} /> #{tag.replace(/^#/, '')}
            </span>
          ))}
        </div>
      )}

      {/* Action Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', borderTop: '1px solid #f3f4f6', paddingTop: '0.75rem' }}>
        <button
          onClick={() => onLike && onLike(post._id)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: isLiked ? '#ef4444' : '#6b7280',
            fontWeight: 600,
            fontSize: '0.875rem',
          }}
        >
          <Heart size={18} fill={isLiked ? '#ef4444' : 'none'} color={isLiked ? '#ef4444' : '#6b7280'} />
          <span>{post.likes ? post.likes.length : 0} Likes</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: '#059669',
            fontWeight: 600,
            fontSize: '0.875rem',
          }}
        >
          <MessageSquare size={18} />
          <span>{post.comments ? post.comments.length : 0} Comments</span>
        </button>
      </div>

      {/* Expandable Comments Section */}
      {showComments && (
        <CommentSection
          comments={post.comments || []}
          onAddComment={handleAddComment}
          loading={commentLoading}
        />
      )}
    </div>
  );
};

export default PostCard;
