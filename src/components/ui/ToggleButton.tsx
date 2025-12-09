'use client';

import { Check, X } from 'lucide-react';

interface ToggleButtonProps {
  value: boolean | null;
  onChange: (value: boolean) => void;
  label?: string;
  description?: string;
}

export function ToggleButton({ value, onChange, label, description }: ToggleButtonProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">{label}</label>
      )}
      {description && (
        <p className="text-xs text-gray-500">{description}</p>
      )}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => onChange(true)}
          className={`
            flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 transition-all
            ${value === true
              ? 'border-green-500 bg-green-50 text-green-700'
              : 'border-gray-200 text-gray-500 hover:border-gray-300'
            }
          `}
        >
          <Check className="w-4 h-4" />
          예
        </button>
        <button
          type="button"
          onClick={() => onChange(false)}
          className={`
            flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 transition-all
            ${value === false
              ? 'border-red-500 bg-red-50 text-red-700'
              : 'border-gray-200 text-gray-500 hover:border-gray-300'
            }
          `}
        >
          <X className="w-4 h-4" />
          아니오
        </button>
      </div>
    </div>
  );
}
