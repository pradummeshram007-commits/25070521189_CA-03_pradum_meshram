import React from 'react';
import { Link } from 'react-router-dom';
import { IconAlertTriangle, IconArrowLeft } from '../components/common/Icons';

export const NotFoundPage = () => {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-paper)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1.5rem',
      fontFamily: 'var(--font-body)',
    }}>
      <div style={{
        maxWidth: '520px',
        width: '100%',
        background: 'var(--color-card)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-card)',
        padding: '2.5rem 2rem',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        {/* Wordmark mark */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          marginBottom: '1.5rem',
        }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '6px',
            background: '#7B1E2E',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#F2B33D' }} />
          </div>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--text-secondary)',
          }}>
            SIT NAGPUR · CAMPUS HUB
          </span>
        </div>

        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.78rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: '#7B1E2E',
          marginBottom: '0.5rem',
        }}>
          404 · REGISTRY NOTICE
        </div>

        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '5rem',
          fontWeight: 800,
          lineHeight: 1,
          color: 'var(--text-primary)',
          letterSpacing: '-0.04em',
          marginBottom: '0.5rem',
        }}>
          404
        </div>

        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '1.5rem',
          fontWeight: 800,
          color: 'var(--text-primary)',
          letterSpacing: '-0.02em',
          marginBottom: '0.75rem',
        }}>
          Noticeboard Slip Not Found
        </h1>

        <p style={{
          fontSize: '0.9rem',
          lineHeight: 1.55,
          color: 'var(--text-secondary)',
          maxWidth: '380px',
          marginBottom: '2rem',
        }}>
          The page or hub index you are looking for has either been unpinned, archived, or moved within the SIT Nagpur registry.
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link
            to="/dashboard"
            className="btn btn-primary"
            style={{ height: '44px', padding: '0 24px', textDecoration: 'none' }}
          >
            Return to Dashboard
          </Link>
          <Link
            to="/"
            className="btn btn-secondary"
            style={{ height: '44px', padding: '0 20px', textDecoration: 'none' }}
          >
            Landing Noticeboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
