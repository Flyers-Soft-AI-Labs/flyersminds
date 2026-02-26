import React from 'react';

export const Input = ({ className = '', ...props }) => {
  return (
    <input
      className={`w-full rounded-xl border border-[#c8d7ce] dark:border-slate-700 bg-white/90 dark:bg-slate-800 px-3.5 py-2.5 text-[15px] text-[#132126] dark:text-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] dark:shadow-none transition-all duration-200 placeholder:text-[#7e8d90] dark:placeholder:text-slate-500 focus:border-[#0f766e] dark:focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-[#0f766e]/15 dark:focus:ring-teal-500/20 disabled:cursor-not-allowed disabled:bg-[#edf2ee] dark:disabled:bg-slate-700 disabled:text-[#8a9498] dark:disabled:text-slate-500 ${className}`}
      {...props}
    />
  );
};
