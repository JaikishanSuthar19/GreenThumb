import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout, Search, Bell, User, LogOut, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ onOpenAddPlant }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/plants?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header
      style={{
        background: 'rgba(255, 255, 255, 0.94)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(16, 185, 129, 0.15)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        padding: '0.75rem 1.5rem',
      }}
    >
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}
      >
        {/* Brand Logo */}
        <Link to={isAuthenticated ? '/dashboard' : '/'} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
              color: '#ffffff',
              padding: '8px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
            }}
          >
            <Sprout size={24} />
          </div>
          <div>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#064e3b', letterSpacing: '-0.5px' }}>
              GreenThumb
            </span>
            <span
              style={{
                display: 'block',
                fontSize: '0.65rem',
                fontWeight: 700,
                color: '#059669',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                marginTop: '-4px',
              }}
            >
              Plant Care & Community
            </span>
          </div>
        </Link>

        {/* Global Search Bar */}
        {isAuthenticated && (
          <form
            onSubmit={handleSearchSubmit}
            style={{
              flex: 1,
              maxWidth: '450px',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Search
              size={18}
              color="#059669"
              style={{ position: 'absolute', left: '12px', pointerEvents: 'none' }}
            />
            <input
              type="text"
              placeholder="Search plants (e.g. succulent, monstera)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control"
              style={{
                paddingLeft: '38px',
                borderRadius: '9999px',
                background: '#f0fdf4',
                borderColor: '#a7f3d0',
                fontSize: '0.875rem',
              }}
            />
          </form>
        )}

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {isAuthenticated ? (
            <>
              {onOpenAddPlant && (
                <button
                  onClick={onOpenAddPlant}
                  className="btn btn-primary"
                  style={{ borderRadius: '9999px', padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                >
                  <Plus size={16} /> Add Plant
                </button>
              )}

              <Link
                to="/profile"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#f0fdf4',
                  padding: '4px 10px 4px 4px',
                  borderRadius: '9999px',
                  border: '1px solid #a7f3d0',
                }}
              >
                <img
                  src={
                    user?.avatar ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                  }
                  alt={user?.name || 'User'}
                  style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#064e3b' }}>
                  {user?.name?.split(' ')[0] || 'Gardener'}
                </span>
              </Link>

              <button
                onClick={logout}
                className="btn btn-secondary"
                style={{ padding: '0.5rem 0.75rem', borderRadius: '50%' }}
                title="Log Out"
              >
                <LogOut size={16} color="#dc2626" />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary">
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
