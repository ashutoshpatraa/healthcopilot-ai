import React, { type HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  accentColor?: 'cyan' | 'red' | 'yellow' | 'green' | 'none';
  interactive?: boolean;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  accentColor = 'none',
  interactive = false,
  className = '',
  ...props
}) => {
  const baseClasses = "bg-surface-container-lowest brutalist-border p-6";
  
  let interactiveClasses = '';
  if (interactive) {
    interactiveClasses = "brutalist-shadow hover:brutalist-shadow-cyan active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all cursor-pointer group";
  }

  let borderClasses = '';
  switch (accentColor) {
    case 'cyan': borderClasses = 'border-l-[8px] border-l-[#00E5FF]'; break;
    case 'red': borderClasses = 'border-l-[8px] border-l-[#FF4D4D]'; break;
    case 'yellow': borderClasses = 'border-l-[8px] border-l-[#FFD500]'; break;
    case 'green': borderClasses = 'border-l-[8px] border-l-[#00C853]'; break;
    case 'none': borderClasses = ''; break;
  }

  return (
    <div className={`${baseClasses} ${interactiveClasses} ${borderClasses} ${className}`} {...props}>
      {children}
    </div>
  );
};
