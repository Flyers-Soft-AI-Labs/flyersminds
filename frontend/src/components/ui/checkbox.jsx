import React from 'react';

export const Checkbox = ({
  id,
  checked = false,
  onChange,
  onCheckedChange,
  className = '',
  disabled = false,
  ...props
}) => {
  const handleChange = (e) => {
    const isChecked = e.target.checked;
    if (onChange) {
      onChange(e);
    }
    if (onCheckedChange) {
      onCheckedChange(isChecked);
    }
  };

  return (
    <input
      id={id}
      type="checkbox"
      checked={checked}
      onChange={handleChange}
      disabled={disabled}
      className={`h-4 w-4 cursor-pointer rounded-md border border-[#aebdb3] accent-[#0f766e] focus:outline-none focus:ring-2 focus:ring-[#0f766e]/25 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
};
