'use client';

import { forwardRef } from 'react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  description?: string;
  error?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, description, error, className = '', ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        {description && (
          <p className="text-xs text-gray-500">{description}</p>
        )}
        <textarea
          ref={ref}
          className={`
            w-full px-4 py-3 rounded-xl border border-gray-200
            focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20
            transition-all resize-none text-sm
            placeholder:text-gray-400
            ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : ''}
            ${className}
          `}
          rows={4}
          {...props}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';
