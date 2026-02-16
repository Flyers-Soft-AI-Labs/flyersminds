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
  // Handle both onChange and onCheckedChange for compatibility
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
      className={`w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
};