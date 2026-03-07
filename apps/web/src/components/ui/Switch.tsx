'use client';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
}

export default function Switch({ checked, onChange, label, description, disabled }: SwitchProps) {
  return (
    <div className={`flex items-start justify-between gap-4 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      {(label || description) && (
        <div className="flex flex-col">
          {label && <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white/80">{label}</span>}
          {description && <span className="text-[11px] text-zinc-600 font-medium">{description}</span>}
        </div>
      )}
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`
          relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
          transition-colors duration-300 ease-in-out focus:outline-none ring-offset-black
          ${checked ? 'bg-white' : 'bg-white/[0.08]'}
        `}
      >
        <span
          className={`
            pointer-events-none inline-block h-5 w-5 transform rounded-full shadow-xl 
            transition duration-300 ease-in-out ring-0
            ${checked ? 'translate-x-5 bg-black' : 'translate-x-0 bg-zinc-500'}
          `}
        />
      </button>
    </div>
  );
}
