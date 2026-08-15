import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  labelIcon?: React.ReactNode;
  error?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, labelIcon, error, children, id, ...props }, ref) => {
    return (
      <div className="flex flex-col w-full">
        {label && (
          <label htmlFor={id} className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
            {labelIcon}
            <span>{label}</span>
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={id}
            className={cn(
              'w-full h-12 pl-3.5 pr-9 bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-slate-900 font-semibold text-sm rounded-xl border border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 focus:outline-hidden transition-all appearance-none cursor-pointer',
              error && 'border-rose-500 focus:border-rose-600 focus:ring-rose-500/20',
              className
            )}
            {...props}
          >
            {children}
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
        {error && <p className="text-xs text-rose-600 font-medium mt-1">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
