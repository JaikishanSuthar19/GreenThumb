import React from 'react';
import { Link } from 'react-router-dom';
import { Droplets, Sun, MapPin, Calendar, Edit, Trash2 } from 'lucide-react';
import confetti from 'canvas-confetti';

const PlantCard = ({ plant, onWater, onDelete, onEdit }) => {
  if (!plant) return null;

  const calculateDaysRemaining = (nextDateStr) => {
    if (!nextDateStr) return 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(nextDateStr);
    target.setHours(0, 0, 0, 0);
    const diffTime = target - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const daysLeft = calculateDaysRemaining(plant.nextWatering);
  const isOverdue = daysLeft <= 0;

  const handleQuickWater = (e) => {
    e.stopPropagation();
    e.preventDefault();

    // Trigger celebration confetti
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#34d399', '#10b981', '#60a5fa', '#3b82f6'],
    });

    if (onWater) onWater(plant._id);
  };

  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        padding: 0,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Header Image */}
      <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
        <img
          src={plant.imageUrl || 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&auto=format&fit=crop&q=80'}
          alt={plant.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />

        {/* Health Status Pill */}
        <span
          className={`badge ${
            isOverdue
              ? 'badge-red'
              : plant.healthStatus === 'Thriving'
              ? 'badge-green'
              : 'badge-amber'
          }`}
          style={{ position: 'absolute', top: '12px', right: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}
        >
          {isOverdue ? '⚠️ Needs Water' : plant.healthStatus || 'Healthy'}
        </span>

        {/* Location Tag */}
        <span
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            background: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(4px)',
            color: '#ffffff',
            fontSize: '0.75rem',
            padding: '3px 8px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <MapPin size={12} color="#34d399" /> {plant.location || 'Indoor'}
        </span>
      </div>

      {/* Card Content */}
      <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
            <Link to={`/plants/${plant._id}`}>
              <h3 style={{ fontSize: '1.15rem', color: '#064e3b', fontWeight: 700, margin: 0 }}>
                {plant.name}
              </h3>
            </Link>

            <div style={{ display: 'flex', gap: '4px' }}>
              {onEdit && (
                <button
                  onClick={() => onEdit(plant)}
                  style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', padding: '4px' }}
                  title="Edit Plant"
                >
                  <Edit size={16} />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(plant._id)}
                  style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                  title="Delete Plant"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </div>

          <p style={{ fontSize: '0.825rem', color: '#059669', fontWeight: 600, fontStyle: 'italic', margin: '2px 0 10px 0' }}>
            {plant.species}
          </p>

          <p style={{ fontSize: '0.85rem', color: '#4b5563', lineHeight: 1.4, margin: '0 0 1rem 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {plant.description || 'No description added.'}
          </p>
        </div>

        {/* Schedule & Action Row */}
        <div>
          <div
            style={{
              background: isOverdue ? '#fef2f2' : '#f0fdf4',
              borderRadius: '10px',
              padding: '8px 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '10px',
              border: `1px solid ${isOverdue ? '#fecaca' : '#a7f3d0'}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={16} color={isOverdue ? '#dc2626' : '#059669'} />
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: isOverdue ? '#b91c1c' : '#065f46' }}>
                {isOverdue
                  ? 'Water Overdue!'
                  : daysLeft === 0
                  ? 'Water Today'
                  : `Next in ${daysLeft} days`}
              </span>
            </div>

            <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
              Every {plant.wateringFrequency}d
            </span>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleQuickWater}
              className="btn btn-primary"
              style={{ flex: 1, padding: '0.5rem', fontSize: '0.85rem' }}
            >
              <Droplets size={16} /> Water Now
            </button>
            <Link
              to={`/plants/${plant._id}`}
              className="btn btn-secondary"
              style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
            >
              Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantCard;
