'use client';

import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helper?: string;
  options: { value: string | number; label: string }[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helper, className = '', options, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-2 ml-1">
            {label}
          </label>
        )}
        <div className="relative group">
          <select
            ref={ref}
            className={`
              block w-full rounded-xl bg-white/[0.03] border text-white appearance-none cursor-pointer
              focus:outline-none focus:ring-2 focus:ring-white/10 focus:bg-white/[0.05] transition-all duration-300
              ${error ? 'border-red-500/50 focus:ring-red-500/20' : 'border-white/[0.08] hover:border-white/[0.15]'}
              pl-4 pr-10 py-3 text-[14px] font-medium
              ${className}
            `}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-zinc-900 text-white">
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-zinc-600 group-hover:text-zinc-400 transition-colors">
            <ChevronDown size={16} />
          </div>
        </div>
        {error && <p className="mt-2 ml-1 text-[11px] text-red-500 font-bold uppercase tracking-widest">{error}</p>}
        {helper && !error && <p className="mt-2 ml-1 text-[11px] text-zinc-600 font-medium">{helper}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
