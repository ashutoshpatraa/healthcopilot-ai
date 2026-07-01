/* eslint-disable react-refresh/only-export-components */
import React, { useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  message: string;
  type?: ToastType;
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'info', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const baseClasses = "fixed bottom-container-margin right-container-margin z-50 brutalist-border brutalist-shadow px-6 py-4 flex items-center gap-4 animate-[slideIn_0.2s_ease-out]";
  
  let typeClasses = '';
  let icon = '';
  
  switch (type) {
    case 'success':
      typeClasses = 'bg-[#00C853] text-primary dark:text-black';
      icon = 'check_circle';
      break;
    case 'error':
      typeClasses = 'bg-[#FF4D4D] text-white';
      icon = 'error';
      break;
    case 'warning':
      typeClasses = 'bg-[#FFD500] text-primary dark:text-black';
      icon = 'warning';
      break;
    case 'info':
    default:
      typeClasses = 'bg-cyan-accent text-primary dark:text-black';
      icon = 'info';
      break;
  }

  return (
    <div className={`${baseClasses} ${typeClasses}`} role="alert" aria-live="assertive">
      <span className="material-symbols-outlined" aria-hidden="true" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
      <span className="font-label-caps text-label-caps uppercase">{message}</span>
      <button onClick={onClose} aria-label="Close notification" className="ml-4 hover:opacity-70 transition-opacity flex items-center">
        <span className="material-symbols-outlined text-[20px]" aria-hidden="true">close</span>
      </button>
      <style>
        {`
          @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
        `}
      </style>
    </div>
  );
};

// Global Toast State Management Hook
export const useToast = () => {
  const [toast, setToast] = React.useState<{ message: string; type: ToastType; id: number } | null>(null);

  const showToast = React.useCallback((message: string, type: ToastType = 'info') => {
    setToast({ message, type, id: Date.now() });
  }, []);

  const hideToast = React.useCallback(() => {
    setToast(null);
  }, []);

  return { toast, showToast, hideToast };
};
