import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getPlants, getMyReminders, getPosts, updateReminder, updatePlant } from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import PlantCard from '../components/PlantCard';
import ReminderCard from '../components/ReminderCard';
import PostCard from '../components/PostCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import Modal from '../components/Modal';
import PlantForm from '../components/PlantForm';
import { createPlant } from '../services/api';
import { Sprout, Calendar, Users, AlertTriangle, Plus, Search, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [plants, setPlants] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addLoading, setAddLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [plantsRes, remindersRes, postsRes] = await Promise.all([
        getPlants(),
        getMyReminders(),
        getPosts(),
      ]);

      if (plantsRes.success) setPlants(plantsRes.data || []);
      if (remindersRes.success) setReminders(remindersRes.data || []);
      if (postsRes.success) setRecentPosts((postsRes.data || []).slice(0, 3));
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddPlant = async (plantData) => {
    setAddLoading(true);
    try {
      await createPlant(plantData);
      setIsAddModalOpen(false);
      fetchData();
    } catch (err) {
      alert(err.message || 'Error adding plant');
    } finally {
      setAddLoading(false);
    }
  };

  const handleToggleReminder = async (id, completedStatus) => {
    try {
      await updateReminder(id, { completed: completedStatus });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleQuickWater = async (plantId) => {
    try {
      const targetPlant = plants.find((p) => p._id === plantId);
      if (targetPlant) {
        const nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + (targetPlant.wateringFrequency || 7));
        await updatePlant(plantId, {
          lastWatered: new Date().toISOString(),
          nextWatering: nextDate.toISOString(),
          healthStatus: 'Thriving',
        });
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const pendingReminders = reminders.filter((r) => !r.completed);
  const overdueCount = pendingReminders.filter((r) => {
    const target = new Date(r.reminderDate);
    target.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return target < today;
  }).length;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar onOpenAddPlant={() => setIsAddModalOpen(true)} />

      <div className="app-layout">
        <Sidebar />

        <main className="main-content">
          {/* Welcome Banner */}
          <div
            style={{
              background: 'linear-gradient(135deg, #064e3b 0%, #047857 50%, #065f46 100%)',
              color: '#ffffff',
              borderRadius: '20px',
              padding: '2rem',
              marginBottom: '2rem',
              boxShadow: '0 10px 25px rgba(6, 78, 55, 0.25)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ position: 'relative', zIndex: 2 }}>
              <span className="badge" style={{ background: 'rgba(255,255,255,0.2)', color: '#ffffff', marginBottom: '8px' }}>
                🌿 Active Gardener Workspace
              </span>
              <h1 style={{ color: '#ffffff', fontSize: '2.2rem', fontWeight: 800, margin: '6px 0' }}>
                Welcome back, {user?.name || 'Gardener'}!
              </h1>
              <p style={{ color: '#a7f3d0', fontSize: '1rem', margin: 0, maxWidth: '600px' }}>
                You have <strong>{plants.length} houseplants</strong> in your collection and{' '}
                <strong>{pendingReminders.length} care tasks</strong> pending for this week.
              </p>

              {/* Quick Actions Bar */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '1.25rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="btn btn-primary"
                  style={{ background: '#ffffff', color: '#047857', fontWeight: 700 }}
                >
                  <Plus size={18} /> Add New Plant
                </button>
                <Link
                  to="/plants?search=succulent"
                  className="btn"
                  style={{ background: 'rgba(255,255,255,0.15)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.3)' }}
                >
                  <Search size={18} /> Search Succulents
                </Link>
                <Link
                  to="/identify"
                  className="btn"
                  style={{ background: 'rgba(255,255,255,0.15)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.3)' }}
                >
                  <Sparkles size={18} /> AI Species Identifier
                </Link>
              </div>
            </div>
          </div>

          <ErrorMessage message={error} />

          {loading ? (
            <LoadingSpinner message="Gathering garden metrics and care schedules..." />
          ) : (
            <>
              {/* Stat Cards Row */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '1.25rem',
                  marginBottom: '2rem',
                }}
              >
                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ background: '#ecfdf5', color: '#059669', padding: '14px', borderRadius: '14px' }}>
                    <Sprout size={28} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: 600 }}>Total Plants</span>
                    <h3 style={{ fontSize: '1.8rem', color: '#064e3b', margin: 0, fontWeight: 800 }}>{plants.length}</h3>
                  </div>
                </div>

                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ background: '#fef3c7', color: '#d97706', padding: '14px', borderRadius: '14px' }}>
                    <Calendar size={28} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: 600 }}>Pending Tasks</span>
                    <h3 style={{ fontSize: '1.8rem', color: '#92400e', margin: 0, fontWeight: 800 }}>{pendingReminders.length}</h3>
                  </div>
                </div>

                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ background: overdueCount > 0 ? '#fee2e2' : '#d1fae5', color: overdueCount > 0 ? '#dc2626' : '#059669', padding: '14px', borderRadius: '14px' }}>
                    <AlertTriangle size={28} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: 600 }}>Overdue Waterings</span>
                    <h3 style={{ fontSize: '1.8rem', color: overdueCount > 0 ? '#b91c1c' : '#065f46', margin: 0, fontWeight: 800 }}>
                      {overdueCount}
                    </h3>
                  </div>
                </div>

                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ background: '#e0f2fe', color: '#0284c7', padding: '14px', borderRadius: '14px' }}>
                    <Users size={28} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: 600 }}>Community Feed</span>
                    <h3 style={{ fontSize: '1.8rem', color: '#0369a1', margin: 0, fontWeight: 800 }}>{recentPosts.length}+</h3>
                  </div>
                </div>
              </div>

              {/* Main Content 2-Column Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                {/* Left Column: My Plants Overview */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.3rem', color: '#064e3b', fontWeight: 800, margin: 0 }}>
                      My Houseplant Collection
                    </h3>
                    <Link to="/plants" style={{ fontSize: '0.875rem', fontWeight: 700, color: '#059669', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      View All Plants ({plants.length}) <ArrowRight size={16} />
                    </Link>
                  </div>

                  {plants.length === 0 ? (
                    <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
                      <Sprout size={48} color="#059669" style={{ margin: '0 auto 1rem auto' }} />
                      <h4 style={{ color: '#064e3b', fontSize: '1.2rem', marginBottom: '0.5rem' }}>Your garden is empty!</h4>
                      <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                        Start by cataloging your first houseplant or succulent to receive automated watering notifications.
                      </p>
                      <button onClick={() => setIsAddModalOpen(true)} className="btn btn-primary">
                        <Plus size={18} /> Catalog First Plant
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
                      {plants.slice(0, 4).map((plant) => (
                        <PlantCard key={plant._id} plant={plant} onWater={handleQuickWater} />
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Column: Upcoming Reminders & Community Highlights */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.3rem', color: '#064e3b', fontWeight: 800, margin: 0 }}>
                      Upcoming Schedule
                    </h3>
                    <Link to="/reminders" style={{ fontSize: '0.875rem', fontWeight: 700, color: '#059669' }}>
                      Full Calendar
                    </Link>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '2rem' }}>
                    {pendingReminders.slice(0, 4).map((reminder) => (
                      <ReminderCard
                        key={reminder._id}
                        reminder={reminder}
                        onToggle={handleToggleReminder}
                      />
                    ))}

                    {pendingReminders.length === 0 && (
                      <div className="card" style={{ textAlign: 'center', color: '#059669', padding: '1.5rem' }}>
                        <CheckCircle2 size={32} style={{ margin: '0 auto 6px auto' }} />
                        <p style={{ margin: 0, fontWeight: 600 }}>All plant care tasks are complete!</p>
                      </div>
                    )}
                  </div>

                  {/* Community Feed Preview */}
                  <h3 style={{ fontSize: '1.2rem', color: '#064e3b', fontWeight: 800, marginBottom: '1rem' }}>
                    Community Highlights
                  </h3>
                  {recentPosts.slice(0, 1).map((post) => (
                    <PostCard key={post._id} post={post} />
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Add Plant Modal */}
          <Modal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            title="Catalog a New Houseplant"
          >
            <PlantForm onSubmit={handleAddPlant} loading={addLoading} buttonText="Add to My Collection" />
          </Modal>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
