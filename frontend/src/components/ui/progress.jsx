import React from 'react';

export const Progress = ({ value = 0, className = '', ...props }) => {
  const clampedValue = Math.min(Math.max(value, 0), 100);
  
  return (
    <div className={`w-full bg-gray-200 rounded-full h-2 overflow-hidden ${className}`} {...props}>
      <div
        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
        style={{ width: `${clampedValue}%` }}
      ></div>
    </div>
  );
};