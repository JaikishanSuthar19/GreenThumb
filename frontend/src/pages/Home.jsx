import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Calendar, Users, ShieldCheck, Sparkles, ArrowRight, Search, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-gradient)' }}>
      {/* Navigation Banner */}
      <nav style={{ padding: '1.5rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ background: '#10b981', color: '#ffffff', padding: '8px', borderRadius: '12px' }}>
            <Sprout size={28} />
          </div>
          <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#064e3b' }}>GreenThumb</span>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          {isAuthenticated ? (
            <Link to="/dashboard" className="btn btn-primary">
              Go to Dashboard <ArrowRight size={18} />
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary">
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary">
                Join GreenThumb
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ padding: '4rem 1.5rem 2rem 1.5rem', textAlign: 'center', maxWidth: '900px', margin: '0 auto' }}>
        <span className="badge badge-green" style={{ marginBottom: '1rem', fontSize: '0.85rem', padding: '6px 14px' }}>
          🌿 Ultimate Plant Care & Community Platform
        </span>
        <h1 style={{ fontSize: '3.2rem', fontWeight: 800, color: '#064e3b', marginBottom: '1.25rem', lineHeight: 1.15 }}>
          Never let another houseplant wither again.
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#4b5563', marginBottom: '2rem', lineHeight: 1.6 }}>
          Catalog your personal botanical collection, set custom watering schedules, identify plant species, and share care tips with a passionate urban gardening community.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/register" className="btn btn-primary" style={{ padding: '0.85rem 2rem', fontSize: '1.05rem', borderRadius: '9999px' }}>
            Get Started Free <ArrowRight size={20} />
          </Link>
          <Link to="/login" className="btn btn-secondary" style={{ padding: '0.85rem 2rem', fontSize: '1.05rem', borderRadius: '9999px' }}>
            Try Demo Account
          </Link>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section style={{ maxWidth: '1200px', margin: '4rem auto', padding: '0 1.5rem' }}>
        <h2 style={{ textAlign: 'center', color: '#064e3b', fontSize: '2rem', fontWeight: 800, marginBottom: '2.5rem' }}>
          Everything your urban jungle needs to thrive
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <div className="card">
            <div style={{ background: '#ecfdf5', color: '#059669', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <Sprout size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', color: '#064e3b', marginBottom: '0.5rem' }}>Plant Collection Catalog</h3>
            <p style={{ color: '#4b5563', fontSize: '0.9rem', lineHeight: 1.5 }}>
              Track nickname, botanical species, light requirements, and upload plant photos stored directly in Firebase Storage.
            </p>
          </div>

          <div className="card">
            <div style={{ background: '#ecfdf5', color: '#059669', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <Calendar size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', color: '#064e3b', marginBottom: '0.5rem' }}>Smart Care Reminders</h3>
            <p style={{ color: '#4b5563', fontSize: '0.9rem', lineHeight: 1.5 }}>
              Automatic watering, fertilizing, and repotting schedules tailored to individual species and room locations.
            </p>
          </div>

          <div className="card">
            <div style={{ background: '#ecfdf5', color: '#059669', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <Users size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', color: '#064e3b', marginBottom: '0.5rem' }}>Gardener Community Feed</h3>
            <p style={{ color: '#4b5563', fontSize: '0.9rem', lineHeight: 1.5 }}>
              Share propagation success photos, ask diagnostic questions, comment on care tips, and join real-time chat rooms.
            </p>
          </div>

          <div className="card">
            <div style={{ background: '#ecfdf5', color: '#059669', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <Search size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', color: '#064e3b', marginBottom: '0.5rem' }}>Species & Succulent Search</h3>
            <p style={{ color: '#4b5563', fontSize: '0.9rem', lineHeight: 1.5 }}>
              Search for succulents, Monsteras, and tropical species to retrieve instant watering & sunlight instructions.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
