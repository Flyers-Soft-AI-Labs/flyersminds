import React from 'react';

export const Badge = ({ children, className = '', variant = 'default', ...props }) => {
  const variants = {
    default: 'border border-[#b8d4cb] bg-[#e8f6f2] text-[#0f766e]',
    success: 'border border-[#a6dcb5] bg-[#e9f9ee] text-[#177842]',
    warning: 'border border-[#f2d39c] bg-[#fff4de] text-[#ad6506]',
    danger: 'border border-[#e5b3ab] bg-[#ffefec] text-[#b74837]',
    secondary: 'border border-[#d3ddd6] bg-[#f3f6f4] text-[#516369]',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${variants[variant] || variants.default} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
