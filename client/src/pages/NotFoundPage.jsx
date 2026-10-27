import React from 'react';
import { Link } from 'react-router-dom';

export const NotFoundPage = () => {
  return (
    <div style={{
      minHeight: '70vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 1.25rem',
      textAlign: 'center',
    }}>
      <div style={{
        fontSize: '6rem',
        fontWeight: 800,
        color: 'var(--primary-navy)',
        lineHeight: 1,
        marginBottom: '1rem',
      }}>
        404
      </div>
      <h2 style={{ fontSize: '1.75rem', color: 'var(--primary-navy)', marginBottom: '0.75rem' }}>
        Page Not Found
      </h2>
      <p style={{ color: 'var(--text-muted)', maxWidth: '440px', marginBottom: '2rem', fontSize: '0.95rem' }}>
        The page you are looking for does not exist or has been moved within the SIT Nagpur Campus Hub.
      </p>
      <Link to="/dashboard" className="btn btn-primary btn-lg">
        Go to Dashboard
      </Link>
    </div>
  );
};

export default NotFoundPage;
