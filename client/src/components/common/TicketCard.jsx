import React from 'react';

export const TicketCard = ({
  passId = 'PASS · SITN-84',
  num = '#02',
  status = 'Confirmed',
  venue = 'Sports Complex',
  title = 'Table Tennis',
  time = 'TODAY · 18:00–19:00',
  court = 'Court #2 · Indoor Arena Annex',
  pin = 'PIN: 4892',
  icon = null,
  action = null,
  className = '',
}) => {
  return (
    <article className={`ticket-card ${className}`}>
      {/* Left Ticket Stub */}
      <div className="ticket-stub select-none">
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '9px',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: 'var(--color-ink-muted)',
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
          }}
        >
          {passId}
        </span>
        {icon && (
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            background: 'var(--hub-sports-tint)',
            color: 'var(--hub-sports)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {icon}
          </div>
        )}
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-ink-muted)' }}>
          {num}
        </span>
      </div>

      {/* Ticket Body */}
      <div style={{ flex: 1, padding: '1rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
            <span style={{
              background: 'var(--hub-sports-tint)',
              color: 'var(--hub-sports)',
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              padding: '2px 6px',
              borderRadius: '4px',
            }}>
              {status}
            </span>
            <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--color-ink-muted)' }}>
              {venue}
            </span>
          </div>

          <h3 style={{ fontSize: '1.25rem', color: 'var(--color-ink)', fontWeight: 700 }}>
            {title}
          </h3>

          <div style={{
            marginTop: '0.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            color: 'var(--color-ink-secondary)',
          }}>
            <span>{time}</span>
          </div>

          <p style={{ fontSize: '13px', color: 'var(--color-ink-secondary)', marginTop: '0.25rem' }}>
            {court}
          </p>
        </div>

        <div style={{
          paddingTop: '0.75rem',
          marginTop: '0.75rem',
          borderTop: '1px solid var(--color-line)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-ink-muted)' }}>
            {pin}
          </span>
          {action}
        </div>
      </div>
    </article>
  );
};

export default TicketCard;
