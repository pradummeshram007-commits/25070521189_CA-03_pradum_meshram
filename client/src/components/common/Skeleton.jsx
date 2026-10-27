import React from 'react';

export const Skeleton = ({
  width = '100%',
  height = '20px',
  borderRadius = '8px',
  className = '',
  style = {},
}) => {
  return (
    <div
      className={className}
      style={{
        width,
        height,
        borderRadius,
        backgroundColor: 'var(--color-sunken)',
        animation: 'pulse 1.5s ease-in-out infinite',
        ...style,
      }}
    />
  );
};

export default Skeleton;
