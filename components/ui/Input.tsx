import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, prefixIcon, suffixIcon, error, id, ...props }, ref) => {
    return (
      <div className="flex flex-col w-full">
        {label && (
          <label htmlFor={id} className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {prefixIcon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              {prefixIcon}
            </div>
          )}
          <input
            ref={ref}
            id={id}
            className={cn(
              'w-full h-12 bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-slate-900 font-bold text-base rounded-xl border border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 focus:outline-hidden transition-all',
              prefixIcon ? 'pl-9' : 'pl-3.5',
              suffixIcon ? 'pr-9' : 'pr-3.5',
              error && 'border-rose-500 focus:border-rose-600 focus:ring-rose-500/20',
              className
            )}
            {...props}
          />
          {suffixIcon && (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              {suffixIcon}
            </div>
          )}
        </div>
        {error && <p className="text-xs text-rose-600 font-medium mt-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
