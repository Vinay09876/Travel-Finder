import React from 'react';
import { cn } from '@/lib/utils';
import { BudgetStatus } from '@/types';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'fits' | 'near' | 'over' | 'teal' | 'neutral' | 'emerald' | 'amber' | 'outline';
  status?: BudgetStatus;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant,
  status,
  children,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap select-none';

  // If status is provided, map directly
  let resolvedVariant = variant || 'neutral';
  if (status) {
    resolvedVariant = status;
  }

  const variants = {
    fits: 'bg-emerald-50 text-emerald-800 border border-emerald-300',
    near: 'bg-amber-50 text-amber-900 border border-amber-300',
    over: 'bg-slate-100 text-slate-700 border border-slate-300',
    teal: 'bg-teal-50 text-teal-800 border border-teal-200',
    neutral: 'bg-slate-100 text-slate-700 border border-slate-200',
    emerald: 'bg-emerald-600 text-white shadow-xs',
    amber: 'bg-amber-600 text-white shadow-xs',
    outline: 'bg-white text-slate-700 border border-slate-200',
  };

  return (
    <span className={cn(baseStyles, variants[resolvedVariant as keyof typeof variants] || variants.neutral, className)} {...props}>
      {children}
    </span>
  );
};
