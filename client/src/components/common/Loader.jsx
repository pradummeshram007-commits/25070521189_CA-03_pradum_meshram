import React from 'react';

export const Loader = ({ message = 'Loading...' }) => {
  return (
    <div className="spinner-wrapper">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
        <div className="spinner" />
        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>
          {message}
        </span>
      </div>
    </div>
  );
};

export default Loader;
