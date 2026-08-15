import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'dark' | 'emerald' | 'amber';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-bold transition-all focus:outline-hidden disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-[0.99] select-none';

    const variants = {
      primary:
        'bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white shadow-sm shadow-teal-700/10',
      secondary:
        'bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200/80',
      outline:
        'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300',
      ghost:
        'bg-transparent hover:bg-slate-100 text-slate-700',
      dark:
        'bg-slate-900 hover:bg-slate-800 text-white shadow-xs',
      emerald:
        'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs',
      amber:
        'bg-amber-500 hover:bg-amber-600 text-slate-950 font-black shadow-xs',
    };

    const sizes = {
      sm: 'text-xs px-3 py-1.5 rounded-lg gap-1.5',
      md: 'text-sm px-4 py-2.5 rounded-xl gap-2',
      lg: 'text-base px-6 py-3.5 rounded-xl gap-2.5',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
