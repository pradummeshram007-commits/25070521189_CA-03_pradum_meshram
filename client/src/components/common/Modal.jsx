import React, { useEffect, useState } from 'react';
import { IconX } from './Icons';

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = '580px',
}) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // On Mobile: Render as Bottom Sheet
  if (isMobile) {
    return (
      <div className="bottom-sheet-overlay" onClick={onClose} role="dialog" aria-modal="true">
        <div className="bottom-sheet-content" onClick={(e) => e.stopPropagation()}>
          <div style={{
            width: '36px',
            height: '4px',
            backgroundColor: 'var(--color-line)',
            borderRadius: '2px',
            margin: '0 auto 1rem',
          }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--color-ink)', fontWeight: 700 }}>
              {title}
            </h3>
            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: 'var(--color-ink-secondary)' }}
              aria-label="Close"
            >
              <IconX size={20} />
            </button>
          </div>
          <div style={{ maxHeight: '75vh', overflowY: 'auto' }}>
            {children}
          </div>
        </div>
      </div>
    );
  }

  // On Desktop: Render as Card Modal
  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-card"
        style={{ maxWidth }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3 style={{ fontSize: '1.25rem', color: 'var(--color-ink)', fontWeight: 700 }}>
            {title}
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              color: 'var(--color-ink-muted)',
              borderRadius: '4px',
            }}
            aria-label="Close modal"
          >
            <IconX size={20} />
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
