import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sprout, LogIn, Sparkles } from 'lucide-react';
import ErrorMessage from '../components/ErrorMessage';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, clearError, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      // Error state handled in AuthContext
    }
  };

  const handleDemoLogin = async () => {
    setEmail('demo@greenthumb.io');
    setPassword('password123');
    try {
      await login('demo@greenthumb.io', 'password123');
      navigate(from, { replace: true });
    } catch (err) {
      // Error handled
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        background: 'var(--bg-gradient)',
      }}
    >
      <div className="card" style={{ maxWidth: '440px', width: '100%', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div
            style={{
              background: '#10b981',
              color: '#ffffff',
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem auto',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)',
            }}
          >
            <Sprout size={32} />
          </div>
          <h2 style={{ fontSize: '1.75rem', color: '#064e3b', fontWeight: 800 }}>Welcome Back</h2>
          <p style={{ fontSize: '0.9rem', color: '#4b5563', marginTop: '4px' }}>
            Sign in to manage your plant care schedule
          </p>
        </div>

        <ErrorMessage message={error} onClose={clearError} />

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              className="form-control"
              placeholder="gardener@greenthumb.io"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem' }}
          >
            <LogIn size={18} /> {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* Quick Demo Login */}
        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <button
            type="button"
            onClick={handleDemoLogin}
            className="btn btn-secondary"
            style={{ width: '100%', padding: '0.65rem', fontSize: '0.85rem' }}
          >
            <Sparkles size={16} color="#d97706" /> One-Click Quick Demo Login
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: '#4b5563' }}>
          Don't have a gardener account?{' '}
          <Link to="/register" style={{ fontWeight: 700, color: '#059669' }}>
            Register Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
