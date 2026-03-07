'use client';

import * as React from 'react';

interface SliderProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  label?: string;
  unit?: string;
  disabled?: boolean;
}

export default function Slider({
  value,
  min,
  max,
  step = 1,
  onChange,
  label,
  unit = '',
  disabled,
}: SliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={`w-full ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      <div className="flex justify-between items-center mb-3 px-1">
        {label && <label className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500">{label}</label>}
        <span className="text-[13px] font-black font-mono text-white tabular-nums">
          {value}{unit}
        </span>
      </div>
      <div className="relative w-full h-6 flex items-center group">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute w-full h-2 opacity-0 z-10 cursor-pointer"
          disabled={disabled}
        />
        <div className="w-full h-1 bg-white/[0.08] rounded-full overflow-hidden">
          <div
            className="h-full bg-white transition-all duration-75 ease-out shadow-[0_0_10px_rgba(255,255,255,0.2)]"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div
          className="absolute w-4 h-4 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-transform duration-75 pointer-events-none group-hover:scale-125 border-4 border-black"
          style={{ left: `calc(${percentage}% - 8px)` }}
        />
      </div>
      <div className="flex justify-between text-[9px] text-zinc-700 font-bold uppercase tracking-tighter px-1 mt-1">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
}
