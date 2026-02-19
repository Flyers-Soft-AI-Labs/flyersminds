import React from 'react';

export const Progress = ({ value = 0, className = '', ...props }) => {
  const clampedValue = Math.min(Math.max(value, 0), 100);

  return (
    <div
      className={`h-2 w-full overflow-hidden rounded-full bg-[#d9e4dd] ${className}`}
      {...props}
    >
      <div
        className="h-full rounded-full bg-[linear-gradient(90deg,#0f766e_0%,#14b8a6_52%,#f59e0b_100%)] transition-all duration-500 ease-out"
        style={{ width: `${clampedValue}%` }}
      />
    </div>
  );
};
