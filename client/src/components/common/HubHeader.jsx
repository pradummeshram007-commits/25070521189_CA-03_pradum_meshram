import React from 'react';

export const HubHeader = ({
  hubNumber = '01',
  category = 'CAMPUS REGISTRY',
  title = 'Hub Title',
  description = 'Hub description here.',
  stripColor = 'var(--hub-lost)',
  stripTint = 'var(--hub-lost-tint)',
  actionButton = null,
  activeCountText = '',
  ledgerText = '',
}) => {
  return (
    <section className="hub-header-container">
      {/* 6px Color Strip */}
      <div className="hub-strip-bar" style={{ backgroundColor: stripColor }} />

      {/* Main Header Row */}
      <div className="hub-header-inner">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: stripColor,
                backgroundColor: stripTint,
                padding: '2px 8px',
                borderRadius: '4px',
                border: `1px solid ${stripColor}33`,
              }}
            >
              HUB {hubNumber}
            </span>
            <span style={{ color: 'var(--color-line)' }}>/</span>
            <span className="eyebrow">{category}</span>
          </div>

          <h1 className="text-h1" style={{ color: 'var(--color-ink)' }}>
            {title}
          </h1>

          <p style={{ color: 'var(--color-ink-secondary)', fontSize: '15px', marginTop: '0.25rem' }}>
            {description}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
          {activeCountText && (
            <div style={{
              display: 'none',
              textAlign: 'right',
              paddingRight: '1rem',
              borderRight: '1px solid var(--color-line)',
            }} className="md:block">
              <span className="eyebrow" style={{ display: 'block', fontSize: '10px' }}>Active Registry</span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-ink)' }}>
                {activeCountText}
              </span>
            </div>
          )}
          {actionButton}
        </div>
      </div>

      {/* Optional Sub-ledger Bar */}
      {ledgerText && (
        <div className="hub-sub-ledger">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: stripColor,
              display: 'inline-block',
            }} />
            <span>{ledgerText}</span>
          </div>
          <span style={{ fontWeight: 600, color: 'var(--color-ink)' }}>REF: SITN-SEM2</span>
        </div>
      )}
    </section>
  );
};

export default HubHeader;
