import React from 'react';

export const Avatar = ({ name = '', size = 34, className = '' }) => {
  const getInitials = (str) => {
    if (!str) return 'S';
    const parts = str.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return str.substring(0, 2).toUpperCase();
  };

  return (
    <div
      className={`avatar ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        fontSize: `${Math.round(size * 0.38)}px`,
      }}
    >
      {getInitials(name)}
    </div>
  );
};

export default Avatar;
