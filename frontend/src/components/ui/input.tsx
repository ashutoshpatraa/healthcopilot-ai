import React, { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ label, error, className = '', id, ...props }, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="font-headline-md text-headline-md text-primary">
          {label}
        </label>
      )}
      <input
        id={inputId}
        ref={ref}
        className={`bg-white text-primary font-body-lg text-body-lg brutalist-border p-4 focus:outline-none focus:border-secondary-container focus:ring-0 ${error ? 'border-[#FF4D4D]' : ''}`}
        {...props}
      />
      {error && <span className="font-label-caps text-label-caps text-[#FF4D4D]">{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ label, error, className = '', id, ...props }, ref) => {
  const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label htmlFor={textareaId} className="font-headline-md text-headline-md text-primary">
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        ref={ref}
        className={`bg-white text-primary font-body-lg text-body-lg brutalist-border p-4 focus:outline-none focus:border-secondary-container focus:ring-0 resize-none ${error ? 'border-[#FF4D4D]' : ''}`}
        {...props}
      />
      {error && <span className="font-label-caps text-label-caps text-[#FF4D4D]">{error}</span>}
    </div>
  );
});

Textarea.displayName = 'Textarea';
