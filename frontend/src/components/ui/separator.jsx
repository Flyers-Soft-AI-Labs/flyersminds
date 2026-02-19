import React from 'react';

export const Separator = ({ className = '', orientation = 'horizontal', ...props }) => {
  if (orientation === 'vertical') {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className={`h-full w-px shrink-0 bg-[#d2ded5] ${className}`}
        {...props}
      />
    );
  }

  return (
    <hr
      className={`my-4 border-0 border-t border-[#d2ded5] ${className}`}
      {...props}
    />
  );
};
