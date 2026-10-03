import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getPlantById, updatePlant, deletePlant, createReminder, updateReminder, deleteReminder } from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import Modal from '../components/Modal';
import PlantForm from '../components/PlantForm';
import ReminderCard from '../components/ReminderCard';
import { Sprout, MapPin, Calendar, Sun, Droplets, Edit, Trash2, ArrowLeft, Plus, ShieldAlert } from 'lucide-react';
import confetti from 'canvas-confetti';

const PlantDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [plant, setPlant] = useState(null);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modals
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isReminderOpen, setIsReminderOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Reminder Form state
  const [reminderTitle, setReminderTitle] = useState('');
  const [reminderDate, setReminderDate] = useState('');
  const [reminderType, setReminderType] = useState('Watering');
  const [reminderNotes, setReminderNotes] = useState('');

  const fetchPlantDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getPlantById(id);
      if (res.success && res.data) {
        setPlant(res.data);
        setReminders(res.data.reminders || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to load plant details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlantDetails();
  }, [id]);

  const handleWaterNow = async () => {
    if (!plant) return;
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#34d399', '#10b981', '#60a5fa'],
    });

    try {
      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + (plant.wateringFrequency || 7));
      await updatePlant(plant._id, {
        lastWatered: new Date().toISOString(),
        nextWatering: nextDate.toISOString(),
        healthStatus: 'Thriving',
      });
      fetchPlantDetails();
    } catch (err) {
      alert(err.message || 'Error updating water log');
    }
  };

  const handleEditSubmit = async (plantData) => {
    setActionLoading(true);
    try {
      await updatePlant(id, plantData);
      setIsEditOpen(false);
      fetchPlantDetails();
    } catch (err) {
      alert(err.message || 'Failed to update plant');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeletePlant = async () => {
    if (window.confirm('Delete this plant permanently?')) {
      try {
        await deletePlant(id);
        navigate('/plants');
      } catch (err) {
        alert(err.message || 'Failed to delete plant');
      }
    }
  };

  const handleCreateReminder = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await createReminder({
        plantId: id,
        title: reminderTitle || `Care for ${plant.name}`,
        reminderDate,
        reminderType,
        notes: reminderNotes,
      });
      setIsReminderOpen(false);
      setReminderTitle('');
      setReminderDate('');
      setReminderNotes('');
      fetchPlantDetails();
    } catch (err) {
      alert(err.message || 'Failed to schedule reminder');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleReminder = async (remId, completedStatus) => {
    try {
      await updateReminder(remId, { completed: completedStatus });
      fetchPlantDetails();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteReminder = async (remId) => {
    try {
      await deleteReminder(remId);
      fetchPlantDetails();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <div className="app-layout">
        <Sidebar />

        <main className="main-content">
          <Link to="/plants" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: '#059669', marginBottom: '1.25rem' }}>
            <ArrowLeft size={18} /> Back to My Plants
          </Link>

          <ErrorMessage message={error} />

          {loading ? (
            <LoadingSpinner message="Fetching plant details..." />
          ) : plant ? (
            <>
              {/* Main Detail Header Card */}
              <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: '2rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 0 }}>
                  <div style={{ position: 'relative', minHeight: '300px' }}>
                    <img
                      src={plant.imageUrl || 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&auto=format&fit=crop&q=80'}
                      alt={plant.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <span
                      className={`badge ${
                        plant.healthStatus === 'Thriving' ? 'badge-green' : 'badge-amber'
                      }`}
                      style={{ position: 'absolute', top: '16px', left: '16px', fontSize: '0.85rem' }}
                    >
                      {plant.healthStatus}
                    </span>
                  </div>

                  <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <h1 style={{ fontSize: '2rem', color: '#064e3b', fontWeight: 800, margin: 0 }}>
                            {plant.name}
                          </h1>
                          <p style={{ fontSize: '1rem', color: '#059669', fontStyle: 'italic', fontWeight: 600, margin: '4px 0 1rem 0' }}>
                            {plant.species}
                          </p>
                        </div>

                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => setIsEditOpen(true)} className="btn btn-secondary" style={{ padding: '0.5rem' }}>
                            <Edit size={16} /> Edit
                          </button>
                          <button onClick={handleDeletePlant} className="btn btn-danger" style={{ padding: '0.5rem' }}>
                            <Trash2 size={16} /> Delete
                          </button>
                        </div>
                      </div>

                      <p style={{ color: '#4b5563', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                        {plant.description || 'No description provided for this plant.'}
                      </p>

                      {/* Info Pills Grid */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div style={{ background: '#f0fdf4', padding: '10px 14px', borderRadius: '12px', border: '1px solid #a7f3d0' }}>
                          <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <MapPin size={14} /> Location
                          </span>
                          <span style={{ fontSize: '0.9rem', color: '#064e3b', fontWeight: 600 }}>{plant.location}</span>
                        </div>

                        <div style={{ background: '#f0fdf4', padding: '10px 14px', borderRadius: '12px', border: '1px solid #a7f3d0' }}>
                          <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Sun size={14} /> Sunlight
                          </span>
                          <span style={{ fontSize: '0.9rem', color: '#064e3b', fontWeight: 600 }}>{plant.sunlightRequirement}</span>
                        </div>

                        <div style={{ background: '#f0fdf4', padding: '10px 14px', borderRadius: '12px', border: '1px solid #a7f3d0' }}>
                          <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Droplets size={14} /> Frequency
                          </span>
                          <span style={{ fontSize: '0.9rem', color: '#064e3b', fontWeight: 600 }}>Every {plant.wateringFrequency} days</span>
                        </div>

                        <div style={{ background: '#f0fdf4', padding: '10px 14px', borderRadius: '12px', border: '1px solid #a7f3d0' }}>
                          <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Calendar size={14} /> Next Water Date
                          </span>
                          <span style={{ fontSize: '0.9rem', color: '#064e3b', fontWeight: 600 }}>
                            {new Date(plant.nextWatering).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button onClick={handleWaterNow} className="btn btn-primary" style={{ flex: 1, padding: '0.75rem' }}>
                        <Droplets size={18} /> Mark Watered Today
                      </button>
                      <button onClick={() => setIsReminderOpen(true)} className="btn btn-secondary" style={{ padding: '0.75rem 1rem' }}>
                        <Plus size={18} /> Add Reminder
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Plant Reminders List */}
              <div className="card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.3rem', color: '#064e3b', fontWeight: 800, margin: 0 }}>
                    Care Schedule & Reminders
                  </h3>
                  <button onClick={() => setIsReminderOpen(true)} className="btn btn-secondary" style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}>
                    <Plus size={16} /> Schedule Reminder
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {reminders.map((rem) => (
                    <ReminderCard
                      key={rem._id}
                      reminder={{ ...rem, plantId: plant }}
                      onToggle={handleToggleReminder}
                      onDelete={handleDeleteReminder}
                    />
                  ))}

                  {reminders.length === 0 && (
                    <p style={{ color: '#6b7280', fontStyle: 'italic', margin: 0, textAlign: 'center', padding: '1.5rem' }}>
                      No care reminders set for this plant yet. Click "Add Reminder" above to set a schedule!
                    </p>
                  )}
                </div>
              </div>
            </>
          ) : null}

          {/* Edit Modal */}
          <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Plant Information">
            <PlantForm initialData={plant} onSubmit={handleEditSubmit} loading={actionLoading} buttonText="Save Plant Changes" />
          </Modal>

          {/* Schedule Reminder Modal */}
          <Modal isOpen={isReminderOpen} onClose={() => setIsReminderOpen(false)} title={`Schedule Care Reminder for ${plant?.name}`}>
            <form onSubmit={handleCreateReminder}>
              <div className="form-group">
                <label>Reminder Title *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder={`e.g. Water ${plant?.name}, Fertilize with seaweed extract`}
                  value={reminderTitle}
                  onChange={(e) => setReminderTitle(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Reminder Date & Time *</label>
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
                <label>Notes & Instructions</label>
                <textarea
                  className="form-control"
                  placeholder="e.g. Use lukewarm filtered water and soak until water runs out drainage holes."
                  value={reminderNotes}
                  onChange={(e) => setReminderNotes(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={actionLoading} style={{ width: '100%', marginTop: '1rem', padding: '0.75rem' }}>
                {actionLoading ? 'Scheduling...' : 'Save Reminder'}
              </button>
            </form>
          </Modal>
        </main>
      </div>
    </div>
  );
};

export default PlantDetails;
