import React from 'react';

export const Input = ({ className = '', ...props }) => {
  return (
    <input
      className={`w-full rounded-xl border border-[#c8d7ce] bg-white/90 px-3.5 py-2.5 text-[15px] text-[#132126] shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] transition-all duration-200 placeholder:text-[#7e8d90] focus:border-[#0f766e] focus:outline-none focus:ring-4 focus:ring-[#0f766e]/15 disabled:cursor-not-allowed disabled:bg-[#edf2ee] disabled:text-[#8a9498] ${className}`}
      {...props}
    />
  );
};
