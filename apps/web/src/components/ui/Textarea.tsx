'use client';

import { forwardRef } from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helper?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helper, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-2 ml-1">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`
            block w-full rounded-2xl bg-white/[0.03] border text-white placeholder-zinc-700 
            focus:outline-none focus:ring-2 focus:ring-white/10 focus:bg-white/[0.05] transition-all duration-300
            ${error ? 'border-red-500/50 focus:ring-red-500/20' : 'border-white/[0.08] hover:border-white/[0.15]'}
            px-5 py-4 text-[14px] font-medium min-h-[140px] resize-y custom-scrollbar
            ${className}
          `}
          {...props}
        />
        {error && <p className="mt-2 ml-1 text-[11px] text-red-500 font-bold uppercase tracking-widest">{error}</p>}
        {helper && !error && <p className="mt-2 ml-1 text-[11px] text-zinc-600 font-medium">{helper}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
