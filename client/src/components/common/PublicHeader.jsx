import React from 'react';
import { Link } from 'react-router-dom';

export const PublicHeader = () => {
  return (
    <header className="public-header">
      <div className="public-header-inner">
        <Link to="/" className="wordmark">
          <div className="wordmark-box">
            <span className="wordmark-dot" />
          </div>
          <div className="wordmark-text-wrap">
            <span className="wordmark-eyebrow">SIT NAGPUR</span>
            <span className="wordmark-title">Campus Hub</span>
          </div>
        </Link>

        {/* The ONLY buttons allowed on Landing header are Login and Sign Up */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Link
            to="/login"
            className="btn-campus btn-secondary-line"
            style={{ height: '38px', padding: '0 1rem', fontSize: '14px' }}
          >
            Log in
          </Link>
          <Link
            to="/signup"
            className="btn-campus btn-primary-ink"
            style={{ height: '38px', padding: '0 1.25rem', fontSize: '14px' }}
          >
            Sign up
          </Link>
        </div>
      </div>
    </header>
  );
};

export default PublicHeader;
