import React from 'react';

export const Footer = () => {
  return (
    <footer style={{
      background: '#ffffff',
      borderTop: '1px solid var(--border-subtle)',
      padding: '2rem 1.25rem',
      textAlign: 'center',
      marginTop: 'auto',
    }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
        <p style={{ fontWeight: 700, color: 'var(--primary-navy)', fontSize: '0.95rem' }}>
          Symbiosis Institute of Technology, Nagpur
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          SIT Nagpur Campus Hub &bull; Made by students of SIT Nagpur
        </p>
        <p style={{ color: 'var(--text-light)', fontSize: '0.78rem' }}>
          &copy; {new Date().getFullYear()} Symbiosis International (Deemed University). All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
