import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  fullWidth?: boolean;
  className?: string;
  icon?: string;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  icon,
  ...props 
}) => {
  const baseClasses = "font-label-caps text-label-caps p-3 transition-all flex justify-center items-center gap-2 brutalist-border uppercase whitespace-nowrap";
  const interactiveClasses = "brutalist-shadow active:translate-x-[6px] active:translate-y-[6px] active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed";
  
  let variantClasses = '';
  switch (variant) {
    case 'primary':
      variantClasses = `bg-primary text-white ${interactiveClasses}`;
      break;
    case 'secondary':
      variantClasses = `bg-white text-primary hover:bg-secondary-container ${interactiveClasses}`;
      break;
    case 'danger':
      variantClasses = `bg-[#FF4D4D] text-white hover:bg-opacity-90 ${interactiveClasses}`;
      break;
    case 'ghost':
      variantClasses = "bg-transparent text-primary hover:bg-surface-variant shadow-none border-transparent hover:border-primary";
      break;
  }

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button className={`${baseClasses} ${variantClasses} ${widthClass} ${className}`} {...props}>
      {icon && <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden="true">{icon}</span>}
      {children}
    </button>
  );
};
