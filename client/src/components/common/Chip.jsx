import React from 'react';

export const Chip = ({
  children,
  active = false,
  onClick,
  badge = null,
  colorVariant = null, // 'lost' | 'sports' | 'booking' | 'market' | 'emergency' | 'feedback'
  className = '',
  ...props
}) => {
  let colorClass = '';
  if (colorVariant) {
    colorClass = `badge-${colorVariant}`;
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`chip ${active ? 'active' : ''} ${colorClass} ${className}`}
      {...props}
    >
      <span>{children}</span>
      {badge !== null && (
        <span style={{
          fontSize: '10px',
          padding: '0.1rem 0.35rem',
          borderRadius: '4px',
          background: active ? 'rgba(255,255,255,0.2)' : 'var(--color-sunken)',
          color: active ? '#fff' : 'inherit',
          fontFamily: 'var(--font-mono)',
        }}>
          {badge}
        </span>
      )}
    </button>
  );
};

export default Chip;
