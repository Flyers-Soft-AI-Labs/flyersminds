import React from 'react';

const baseStyles =
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-semibold tracking-tight transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f766e]/40 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60';

const variantStyles = {
  default:
    'bg-[#0f766e] text-white shadow-[0_14px_34px_-20px_rgba(15,118,110,0.95)] hover:bg-[#0d5e59] active:translate-y-[1px]',
  primary:
    'bg-[#0f766e] text-white shadow-[0_14px_34px_-20px_rgba(15,118,110,0.95)] hover:bg-[#0d5e59] active:translate-y-[1px]',
  outline:
    'border border-[#b9cbc0] bg-white/85 text-[#1a2c31] shadow-[0_6px_20px_-18px_rgba(15,23,42,0.7)] hover:border-[#0f766e]/40 hover:bg-[#f1f8f4]',
  ghost: 'bg-transparent text-[#31444b] hover:bg-[#e7f2ec] hover:text-[#0f766e]',
  secondary:
    'bg-[#e7f4f0] text-[#0f766e] border border-[#b9d7cc] hover:bg-[#dbeee8]',
  destructive:
    'bg-[#d13f2e] text-white shadow-[0_14px_34px_-24px_rgba(209,63,46,0.95)] hover:bg-[#b93829]',
};

const sizeStyles = {
  sm: 'h-9 px-3.5 text-sm',
  default: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-base',
  icon: 'h-10 w-10 p-0',
};

export const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'default',
  size = 'default',
  className = '',
  disabled = false,
  ...props
}) => {
  const selectedVariant = variantStyles[variant] ? variant : 'default';
  const selectedSize = sizeStyles[size] ? size : 'default';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[selectedVariant]} ${sizeStyles[selectedSize]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
