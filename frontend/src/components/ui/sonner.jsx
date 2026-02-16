import React from 'react';

export const Toaster = ({ ...props }) => {
  return <div id="toast-container" className="fixed bottom-4 right-4 space-y-2" {...props} />;
};

export const toast = {
  success: (message) => {
    console.log('✓ Success:', message);
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('toast', { detail: { type: 'success', message } });
      window.dispatchEvent(event);
    }
  },
  error: (message) => {
    console.error('✗ Error:', message);
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('toast', { detail: { type: 'error', message } });
      window.dispatchEvent(event);
    }
  },
  info: (message) => {
    console.log('ℹ Info:', message);
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('toast', { detail: { type: 'info', message } });
      window.dispatchEvent(event);
    }
  },
  loading: (message) => {
    console.log('⏳ Loading:', message);
  },
};