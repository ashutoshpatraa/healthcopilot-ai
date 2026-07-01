import React, { type ButtonHTMLAttributes } from 'react';

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
  const baseClasses = "font-label-caps text-label-caps p-3 transition-colors flex justify-center items-center gap-2 uppercase whitespace-nowrap border-border-width";
  const interactiveClasses = "disabled:opacity-50 disabled:cursor-not-allowed";
  
  let variantClasses = '';
  switch (variant) {
    case 'primary':
      variantClasses = `bg-primary text-on-primary border-border dark:bg-cyan-accent dark:text-[#000000] dark:border-[#000000] hover:bg-surface-container-highest dark:hover:bg-white dark:hover:text-[#000000] brutalist-shadow active:translate-x-[6px] active:translate-y-[6px] active:shadow-none dark:active:translate-x-[0px] dark:active:translate-y-[0px] ${interactiveClasses}`;
      break;
    case 'secondary':
      variantClasses = `bg-transparent text-primary border-border dark:text-white dark:border-white hover:bg-secondary-container dark:hover:bg-white dark:hover:text-black brutalist-shadow active:translate-x-[6px] active:translate-y-[6px] active:shadow-none dark:active:translate-x-[0px] dark:active:translate-y-[0px] ${interactiveClasses}`;
      break;
    case 'danger':
      variantClasses = `bg-error text-white border-border hover:opacity-90 brutalist-shadow active:translate-x-[6px] active:translate-y-[6px] active:shadow-none dark:active:translate-x-[0px] dark:active:translate-y-[0px] ${interactiveClasses}`;
      break;
    case 'ghost':
      variantClasses = "bg-transparent text-primary dark:text-white border-transparent hover:border-border dark:hover:border-white";
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
