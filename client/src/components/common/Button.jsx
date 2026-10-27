import React from 'react';

export const Button = ({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'oxblood' | 'danger-pill' | 'text'
  size = 'md', // 'sm' | 'md' | 'lg'
  icon = null,
  className = '',
  disabled = false,
  onClick,
  type = 'button',
  ...props
}) => {
  let variantClass = 'btn-primary-ink';
  if (variant === 'secondary') variantClass = 'btn-secondary-line';
  if (variant === 'oxblood') variantClass = 'btn-oxblood';
  if (variant === 'danger-pill') variantClass = 'btn-danger-pill';
  if (variant === 'text') variantClass = 'bg-transparent border-0 hover:bg-black/5 text-ink';

  const sizeStyle = size === 'sm' ? { height: '36px', padding: '0 0.85rem', fontSize: '13px' } : {};

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`btn-campus ${variantClass} ${className}`}
      style={sizeStyle}
      {...props}
    >
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};

export default Button;
