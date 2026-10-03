import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ErrorMessage from '../components/ErrorMessage';
import { User, Mail, ShieldCheck, LogOut, Save, Sprout } from 'lucide-react';

const Profile = () => {
  const { user, updateUserProfile, logout } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      await updateUserProfile({ name, bio, avatar });
      setSuccessMsg('Profile updated successfully!');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <div className="app-layout">
        <Sidebar />

        <main className="main-content">
          <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '1.8rem', color: '#064e3b', fontWeight: 800, marginBottom: '1.5rem' }}>
              Gardener Profile & Account
            </h1>

            {successMsg && (
              <div style={{ background: '#d1fae5', color: '#065f46', padding: '0.85rem 1rem', borderRadius: '10px', marginBottom: '1rem', fontWeight: 600 }}>
                ✅ {successMsg}
              </div>
            )}

            <ErrorMessage message={errorMsg} onClose={() => setErrorMsg('')} />

            {/* Profile Overview Card */}
            <div className="card" style={{ marginBottom: '1.5rem', textAlign: 'center', padding: '2rem' }}>
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={user?.name}
                style={{ width: '96px', height: '96px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #10b981', margin: '0 auto 1rem auto' }}
              />
              <h2 style={{ fontSize: '1.5rem', color: '#064e3b', margin: 0, fontWeight: 800 }}>{user?.name}</h2>
              <p style={{ color: '#059669', fontSize: '0.9rem', margin: '4px 0 1rem 0' }}>{user?.email}</p>
              <p style={{ color: '#4b5563', fontSize: '0.925rem', maxWidth: '450px', margin: '0 auto 1rem auto', fontStyle: 'italic' }}>
                "{user?.bio || 'Plant lover and urban gardener 🌿'}"
              </p>

              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#ecfdf5', color: '#047857', padding: '6px 14px', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 700 }}>
                <ShieldCheck size={16} /> Authenticated Gardener Account (JWT / Firebase)
              </div>
            </div>

            {/* Profile Edit Card */}
            <div className="card">
              <h3 style={{ fontSize: '1.2rem', color: '#064e3b', fontWeight: 700, marginBottom: '1.25rem' }}>
                Edit Gardener Details
              </h3>

              <form onSubmit={handleSave}>
                <div className="form-group">
                  <label>Display Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Avatar Photo URL</label>
                  <input
                    type="url"
                    className="form-control"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>

                <div className="form-group">
                  <label>Gardener Bio</label>
                  <textarea
                    className="form-control"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell the community about your houseplants..."
                  />
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                  <button type="submit" className="btn btn-primary" disabled={saving} style={{ flex: 1 }}>
                    <Save size={18} /> {saving ? 'Saving...' : 'Save Profile'}
                  </button>
                  <button type="button" onClick={logout} className="btn btn-danger">
                    <LogOut size={18} /> Log Out
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;
