import React from 'react';
import { IconChevronDown, IconAlertTriangle } from './Icons';

export const Select = ({
  label,
  id,
  value,
  onChange,
  options = [],
  error = '',
  helperText = '',
  required = false,
  className = '',
  placeholder = 'Select an option',
  ...props
}) => {
  return (
    <div style={{ marginBottom: '1rem', width: '100%' }}>
      {label && (
        <label htmlFor={id} className="input-label">
          {label} {required && <span style={{ color: 'var(--status-error)' }}>*</span>}
        </label>
      )}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <select
          id={id}
          value={value}
          onChange={onChange}
          required={required}
          className={`input-field ${error ? 'error' : ''} ${className}`}
          style={{ appearance: 'none', paddingRight: '36px', cursor: 'pointer' }}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => {
            const val = typeof opt === 'string' ? opt : opt.value;
            const text = typeof opt === 'string' ? opt : opt.label;
            return (
              <option key={val} value={val}>
                {text}
              </option>
            );
          })}
        </select>
        <span style={{ position: 'absolute', right: '10px', pointerEvents: 'none', color: 'var(--color-ink-secondary)' }}>
          <IconChevronDown size={18} />
        </span>
      </div>
      {error ? (
        <div className="input-error-msg">
          <IconAlertTriangle size={14} />
          <span>{error}</span>
        </div>
      ) : helperText ? (
        <div style={{ fontSize: '13px', color: 'var(--color-ink-muted)', marginTop: '0.25rem' }}>
          {helperText}
        </div>
      ) : null}
    </div>
  );
};

export default Select;
