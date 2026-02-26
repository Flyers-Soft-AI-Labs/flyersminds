import React from 'react';

export const Label = ({ children, htmlFor, className = '', ...props }) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`mb-2 block text-xs font-semibold uppercase tracking-[0.09em] text-[#3a4c53] dark:text-slate-400 ${className}`}
      {...props}
    >
      {children}
    </label>
  );
};
