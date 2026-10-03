import React from 'react';
import { CheckCircle2, Circle, Calendar, Droplets, Sparkles, Trash2 } from 'lucide-react';
import confetti from 'canvas-confetti';

const ReminderCard = ({ reminder, onToggle, onDelete }) => {
  if (!reminder) return null;

  const isCompleted = reminder.completed;
  const plant = reminder.plantId || {};

  const calculateDaysRemaining = (dateStr) => {
    if (!dateStr) return 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateStr);
    target.setHours(0, 0, 0, 0);
    const diffTime = target - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const daysLeft = calculateDaysRemaining(reminder.reminderDate);
  const isOverdue = !isCompleted && daysLeft < 0;

  const handleToggle = () => {
    if (!isCompleted) {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#34d399', '#10b981', '#fbbf24'],
      });
    }
    if (onToggle) onToggle(reminder._id, !isCompleted);
  };

  return (
    <div
      className="card"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem 1.25rem',
        opacity: isCompleted ? 0.75 : 1,
        background: isCompleted ? '#f9fafb' : '#ffffff',
        borderLeft: `5px solid ${
          isCompleted
            ? '#9ca3af'
            : isOverdue
            ? '#ef4444'
            : reminder.reminderType === 'Watering'
            ? '#10b981'
            : '#f59e0b'
        }`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Toggle Checkbox */}
        <button
          onClick={handleToggle}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          title={isCompleted ? 'Mark incomplete' : 'Mark completed'}
        >
          {isCompleted ? (
            <CheckCircle2 size={26} color="#10b981" />
          ) : (
            <Circle size={26} color="#9ca3af" />
          )}
        </button>

        {/* Plant Thumbnail */}
        {plant.imageUrl && (
          <img
            src={plant.imageUrl}
            alt={plant.name || 'Plant'}
            style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'cover' }}
          />
        )}

        {/* Info */}
        <div>
          <h4
            style={{
              margin: 0,
              fontSize: '1rem',
              color: '#064e3b',
              textDecoration: isCompleted ? 'line-through' : 'none',
              fontWeight: 700,
            }}
          >
            {reminder.title}
          </h4>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
            <span style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 600 }}>
              🌿 {plant.name || 'Plant'}
            </span>
            <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>•</span>
            <span
              className={`badge ${
                reminder.reminderType === 'Watering' ? 'badge-blue' : 'badge-amber'
              }`}
              style={{ fontSize: '0.65rem' }}
            >
              {reminder.reminderType}
            </span>
          </div>

          {reminder.notes && (
            <p style={{ margin: '4px 0 0 0', fontSize: '0.775rem', color: '#6b7280' }}>
              {reminder.notes}
            </p>
          )}
        </div>
      </div>

      {/* Date & Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ textAlign: 'right' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.8rem',
              fontWeight: 700,
              color: isCompleted
                ? '#9ca3af'
                : isOverdue
                ? '#dc2626'
                : daysLeft === 0
                ? '#d97706'
                : '#047857',
            }}
          >
            <Calendar size={14} />
            {isCompleted
              ? 'Completed'
              : isOverdue
              ? `Overdue (${Math.abs(daysLeft)}d)`
              : daysLeft === 0
              ? 'Due Today'
              : `In ${daysLeft} days`}
          </span>
          <div style={{ fontSize: '0.7rem', color: '#9ca3af', marginTop: '2px' }}>
            {new Date(reminder.reminderDate).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
            })}
          </div>
        </div>

        {onDelete && (
          <button
            onClick={() => onDelete(reminder._id)}
            style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: '4px' }}
            title="Delete reminder"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default ReminderCard;
