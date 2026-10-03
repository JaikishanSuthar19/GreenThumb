import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ErrorMessage = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div
      style={{
        background: '#fef2f2',
        border: '1px solid #fecaca',
        borderRadius: '10px',
        padding: '0.85rem 1.2rem',
        color: '#b91c1c',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: '1rem 0',
        fontSize: '0.9rem',
        boxShadow: '0 2px 8px rgba(220, 38, 38, 0.08)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <AlertTriangle size={20} color="#dc2626" />
        <span>{message}</span>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#b91c1c' }}
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
