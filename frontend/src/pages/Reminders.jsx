import React, { useState, useEffect } from 'react';
import { getMyReminders, updateReminder, deleteReminder, createReminder, getPlants } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ReminderCard from '../components/ReminderCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import Modal from '../components/Modal';
import { Calendar, Plus, Filter, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';

const Reminders = () => {
  const { user } = useAuth();
  const [reminders, setReminders] = useState([]);
  const [plants, setPlants] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'overdue', 'completed'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // New Reminder Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlantId, setSelectedPlantId] = useState('');
  const [title, setTitle] = useState('');
  const [reminderDate, setReminderDate] = useState('');
  const [reminderType, setReminderType] = useState('Watering');
  const [notes, setNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [remRes, plantsRes] = await Promise.all([getMyReminders(), getPlants()]);
      if (remRes.success) setReminders(remRes.data || []);
      if (plantsRes.success) {
        setPlants(plantsRes.data || []);
        if (plantsRes.data && plantsRes.data.length > 0) {
          setSelectedPlantId(plantsRes.data[0]._id);
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch care reminders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggle = async (id, completedStatus) => {
    try {
      await updateReminder(id, { completed: completedStatus });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this reminder?')) {
      try {
        await deleteReminder(id);
        fetchData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleCreateReminder = async (e) => {
    e.preventDefault();
    if (!selectedPlantId || !reminderDate) return;

    setActionLoading(true);
    try {
      await createReminder({
        plantId: selectedPlantId,
        title: title || 'Plant Care Task',
        reminderDate,
        reminderType,
        notes,
      });
      setIsModalOpen(false);
      setTitle('');
      setReminderDate('');
      setNotes('');
      fetchData();
    } catch (err) {
      alert(err.message || 'Failed to create reminder');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredReminders = reminders.filter((r) => {
    if (filter === 'completed') return r.completed;
    if (filter === 'pending') return !r.completed;
    if (filter === 'overdue') {
      if (r.completed) return false;
      const target = new Date(r.reminderDate);
      target.setHours(0, 0, 0, 0);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return target < today;
    }
    return true;
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <div className="app-layout">
        <Sidebar />

        <main className="main-content">
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '1.8rem', color: '#064e3b', fontWeight: 800, margin: 0 }}>
                Plant Care Reminders
              </h1>
              <p style={{ color: '#059669', margin: '4px 0 0 0', fontSize: '0.9rem' }}>
                Automated schedule for watering, fertilizing, repotting, and misting
              </p>
            </div>

            <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
              <Plus size={18} /> Schedule New Reminder
            </button>
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setFilter('all')}
              className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.85rem', padding: '0.4rem 1rem' }}
            >
              <Calendar size={14} /> All Tasks ({reminders.length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`btn ${filter === 'pending' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.85rem', padding: '0.4rem 1rem' }}
            >
              <Clock size={14} /> Pending ({reminders.filter((r) => !r.completed).length})
            </button>
            <button
              onClick={() => setFilter('overdue')}
              className={`btn ${filter === 'overdue' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.85rem', padding: '0.4rem 1rem' }}
            >
              <AlertTriangle size={14} /> Overdue
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`btn ${filter === 'completed' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.85rem', padding: '0.4rem 1rem' }}
            >
              <CheckCircle2 size={14} /> Completed ({reminders.filter((r) => r.completed).length})
            </button>
          </div>

          <ErrorMessage message={error} />

          {loading ? (
            <LoadingSpinner message="Fetching care reminders..." />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filteredReminders.map((rem) => (
                <ReminderCard
                  key={rem._id}
                  reminder={rem}
                  onToggle={handleToggle}
                  onDelete={handleDelete}
                />
              ))}

              {filteredReminders.length === 0 && (
                <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
                  <Calendar size={44} color="#059669" style={{ margin: '0 auto 1rem auto' }} />
                  <h3 style={{ color: '#064e3b', fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                    No reminders match your filter!
                  </h3>
                  <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                    Select a different filter above or schedule a new plant care reminder.
                  </p>
                  <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
                    <Plus size={18} /> Schedule Reminder
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Schedule Reminder Modal */}
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Schedule Plant Care Reminder">
            <form onSubmit={handleCreateReminder}>
              <div className="form-group">
                <label>Select Plant *</label>
                <select
                  className="form-control"
                  value={selectedPlantId}
                  onChange={(e) => setSelectedPlantId(e.target.value)}
                  required
                >
                  {plants.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name} ({p.species})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Reminder Title *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Water plant, Fertilize with organic NPK"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Date & Time *</label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    value={reminderDate}
                    onChange={(e) => setReminderDate(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Care Type</label>
                  <select className="form-control" value={reminderType} onChange={(e) => setReminderType(e.target.value)}>
                    <option value="Watering">Watering</option>
                    <option value="Fertilizing">Fertilizing</option>
                    <option value="Repotting">Repotting</option>
                    <option value="Pruning">Pruning</option>
                    <option value="Misting">Misting</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Notes</label>
                <textarea
                  className="form-control"
                  placeholder="Care instructions..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={actionLoading} style={{ width: '100%', marginTop: '1rem', padding: '0.75rem' }}>
                {actionLoading ? 'Saving...' : 'Schedule Reminder'}
              </button>
            </form>
          </Modal>
        </main>
      </div>
    </div>
  );
};

export default Reminders;
