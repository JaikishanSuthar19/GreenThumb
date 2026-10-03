import React from 'react';
import { Sprout } from 'lucide-react';

const LoadingSpinner = ({ message = 'Loading plant data...' }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem' }}>
      <div style={{
        background: '#d1fae5',
        color: '#059669',
        padding: '1rem',
        borderRadius: '50%',
        boxShadow: '0 0 20px rgba(16, 185, 129, 0.3)',
        marginBottom: '1rem'
      }}>
        <Sprout size={36} className="spin" />
      </div>
      <p style={{ color: '#065f46', fontWeight: 600, fontSize: '0.95rem' }}>{message}</p>
    </div>
  );
};

export default LoadingSpinner;
