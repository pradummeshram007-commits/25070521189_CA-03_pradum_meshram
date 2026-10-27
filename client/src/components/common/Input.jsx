import React from 'react';
import { IconAlertTriangle } from './Icons';

export const Input = ({
  label,
  id,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  error = '',
  helperText = '',
  required = false,
  rightElement = null,
  className = '',
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
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`input-field ${error ? 'error' : ''} ${className}`}
          style={rightElement ? { paddingRight: '44px' } : {}}
          {...props}
        />
        {rightElement && (
          <div style={{ position: 'absolute', right: '10px', display: 'flex', alignItems: 'center' }}>
            {rightElement}
          </div>
        )}
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

export default Input;
