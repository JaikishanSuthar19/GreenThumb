import React, { useState, useEffect } from 'react';
import { getPosts, createPost, toggleLikePost, addComment, deletePost } from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import PostCard from '../components/PostCard';
import SocketChat from '../components/SocketChat';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import Modal from '../components/Modal';
import ImageUpload from '../components/ImageUpload';
import { Users, Plus, MessageSquare, Send, Sparkles } from 'lucide-react';

const Community = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('feed'); // 'feed' or 'chat'

  // Create Post Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [tags, setTags] = useState('succulents, care-tips');
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchCommunityPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getPosts();
      if (res.success) {
        setPosts(res.data || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to load community feed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunityPosts();
  }, []);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    setActionLoading(true);

    try {
      if (file) {
        const formData = new FormData();
        formData.append('title', postTitle);
        formData.append('content', postContent);
        formData.append('tags', tags);
        formData.append('image', file);
        await createPost(formData);
      } else {
        await createPost({
          title: postTitle,
          content: postContent,
          tags,
          imageUrl,
        });
      }

      setIsModalOpen(false);
      setPostTitle('');
      setPostContent('');
      setFile(null);
      setImageUrl('');
      fetchCommunityPosts();
    } catch (err) {
      alert(err.message || 'Failed to publish post');
    } finally {
      setActionLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      await toggleLikePost(postId);
      fetchCommunityPosts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = async (postId, text) => {
    try {
      await addComment(postId, text);
      fetchCommunityPosts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm('Delete your post from community feed?')) {
      try {
        await deletePost(postId);
        fetchCommunityPosts();
      } catch (err) {
        alert(err.message || 'Failed to delete post');
      }
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <div className="app-layout">
        <Sidebar />

        <main className="main-content">
          {/* Top Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.5rem',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <h1 style={{ fontSize: '1.8rem', color: '#064e3b', fontWeight: 800, margin: 0 }}>
                GreenThumb Gardener Community
              </h1>
              <p style={{ color: '#059669', margin: '4px 0 0 0', fontSize: '0.9rem' }}>
                Share care tips, show off new growth cuts, ask diagnostic questions, and chat live
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
                <Plus size={18} /> Share Care Tip / Post
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '1.5rem', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px' }}>
            <button
              onClick={() => setActiveTab('feed')}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '1rem',
                fontWeight: 700,
                color: activeTab === 'feed' ? '#059669' : '#6b7280',
                borderBottom: activeTab === 'feed' ? '3px solid #10b981' : 'none',
                paddingBottom: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Users size={18} /> Community Feed ({posts.length})
            </button>

            <button
              onClick={() => setActiveTab('chat')}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '1rem',
                fontWeight: 700,
                color: activeTab === 'chat' ? '#059669' : '#6b7280',
                borderBottom: activeTab === 'chat' ? '3px solid #10b981' : 'none',
                paddingBottom: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <MessageSquare size={18} /> Live Gardener Chat (Socket.io)
            </button>
          </div>

          <ErrorMessage message={error} />

          {activeTab === 'feed' ? (
            <div>
              {loading ? (
                <LoadingSpinner message="Fetching community posts..." />
              ) : (
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                  {posts.map((post) => (
                    <PostCard
                      key={post._id}
                      post={post}
                      onLike={handleLike}
                      onAddComment={handleAddComment}
                      onDelete={handleDeletePost}
                    />
                  ))}

                  {posts.length === 0 && (
                    <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
                      <Users size={48} color="#059669" style={{ margin: '0 auto 1rem auto' }} />
                      <h3 style={{ color: '#064e3b', fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                        No community posts yet!
                      </h3>
                      <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
                        Be the first gardener to share a care tip, photo, or question with the community.
                      </p>
                      <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
                        <Plus size={18} /> Create First Post
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div style={{ maxWidth: '850px', margin: '0 auto' }}>
              <SocketChat />
            </div>
          )}

          {/* Create Post Modal */}
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Community Post">
            <form onSubmit={handleCreatePost}>
              <div className="form-group">
                <label>Post Headline / Title</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Golden rule for watering succulents without root rot"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Post Content & Care Advice *</label>
                <textarea
                  className="form-control"
                  placeholder="Share your experience, propagation guide, or plant question..."
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  style={{ minHeight: '120px' }}
                  required
                />
              </div>

              <div className="form-group">
                <label>Tags (Comma separated)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. succulents, propagation, monstera, care-tips"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>

              <ImageUpload
                onFileSelect={(f) => setFile(f)}
                onUrlSelect={(u) => setImageUrl(u)}
                currentImageUrl={imageUrl}
              />

              <button
                type="submit"
                className="btn btn-primary"
                disabled={actionLoading}
                style={{ width: '100%', padding: '0.75rem', marginTop: '1rem' }}
              >
                <Send size={18} /> {actionLoading ? 'Publishing...' : 'Publish Post to Feed'}
              </button>
            </form>
          </Modal>
        </main>
      </div>
    </div>
  );
};

export default Community;
