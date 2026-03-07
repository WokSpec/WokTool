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
          <label className="block label-tech mb-3 ml-1">
            {label}
          </label>
        )}
        <div className="relative group">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-white/20 group-focus-within:text-accent transition-colors">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={`
              block w-full bg-bg-surface border transition-all duration-500 text-white placeholder:text-white/10
              focus:outline-none
              ${leftIcon ? 'pl-12' : 'pl-5'}
              ${rightIcon ? 'pr-12' : 'pr-5'}
              ${error ? 'border-danger/40 focus:border-danger' : 'border-white/10 focus:border-accent/60'}
              py-4 text-sm font-black uppercase tracking-widest
              ${className}
            `}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-5 flex items-center pointer-events-none text-white/20">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="mt-3 ml-1 text-[9px] text-danger font-black uppercase tracking-[0.25em] animate-in fade-in slide-in-from-top-1">{error}</p>}
        {helper && !error && <p className="mt-3 ml-1 text-[9px] text-white/20 font-black uppercase tracking-[0.25em]">{helper}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
