import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sprout, UserPlus } from 'lucide-react';
import ErrorMessage from '../components/ErrorMessage';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const { register, error, clearError, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters long');
      return;
    }

    try {
      await register(name, email, password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      // Error handled in AuthContext
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
      <div className="card" style={{ maxWidth: '460px', width: '100%', padding: '2.5rem' }}>
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
          <h2 style={{ fontSize: '1.75rem', color: '#064e3b', fontWeight: 800 }}>Create Account</h2>
          <p style={{ fontSize: '0.9rem', color: '#4b5563', marginTop: '4px' }}>
            Join GreenThumb community to catalog your plants
          </p>
        </div>

        <ErrorMessage message={localError || error} onClose={() => { setLocalError(''); clearError(); }} />

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              className="form-control"
              placeholder="Maya Green"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Email Address *</label>
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
            <label>Password (min 6 chars) *</label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Confirm Password *</label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem' }}
          >
            <UserPlus size={18} /> {loading ? 'Creating Account...' : 'Register Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: '#4b5563' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ fontWeight: 700, color: '#059669' }}>
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
