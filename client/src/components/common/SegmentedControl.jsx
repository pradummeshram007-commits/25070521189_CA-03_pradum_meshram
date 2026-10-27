import React from 'react';

export const SegmentedControl = ({
  options = [], // [{ value: 'lost', label: 'Lost', count: 14 }]
  value,
  onChange,
  className = '',
}) => {
  return (
    <div className={`segmented-control ${className}`}>
      {options.map((opt) => {
        const val = typeof opt === 'string' ? opt : opt.value;
        const label = typeof opt === 'string' ? opt : opt.label;
        const count = typeof opt === 'object' ? opt.count : null;
        const isActive = value === val;

        return (
          <button
            key={val}
            type="button"
            className={`segmented-btn ${isActive ? 'active' : ''}`}
            onClick={() => onChange(val)}
          >
            <span>{label}</span>
            {count !== undefined && count !== null && (
              <span
                style={{
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  padding: '1px 6px',
                  borderRadius: '4px',
                  background: isActive ? 'var(--color-sunken)' : 'rgba(0,0,0,0.06)',
                  fontWeight: 600,
                }}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default SegmentedControl;
