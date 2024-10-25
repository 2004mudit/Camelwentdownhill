import React from 'react';

export const Button = ({ children, onClick, className, disabled }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded ${className}`}
    disabled={disabled}
  >
    {children}
  </button>
);
