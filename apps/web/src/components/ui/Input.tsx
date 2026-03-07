'use client';

import { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helper, className = '', leftIcon, rightIcon, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-2 ml-1">
            {label}
          </label>
        )}
        <div className="relative group">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-600 group-focus-within:text-white transition-colors">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={`
              block w-full rounded-xl bg-white/[0.03] border text-white placeholder-zinc-700 
              focus:outline-none focus:ring-2 focus:ring-white/10 focus:bg-white/[0.05] transition-all duration-300
              ${leftIcon ? 'pl-12' : 'pl-4'}
              ${rightIcon ? 'pr-12' : 'pr-4'}
              ${error ? 'border-red-500/50 focus:ring-red-500/20' : 'border-white/[0.08] hover:border-white/[0.15]'}
              py-3 text-[14px] font-medium
              ${className}
            `}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-zinc-600">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="mt-2 ml-1 text-[11px] text-red-500 font-bold uppercase tracking-widest animate-in fade-in slide-in-from-top-1">{error}</p>}
        {helper && !error && <p className="mt-2 ml-1 text-[11px] text-zinc-600 font-medium">{helper}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
