'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface ColorSwatchProps {
  color: string;
  label?: string;
}

export default function ColorSwatch({ color, label }: ColorSwatchProps) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(color);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      onClick={copy}
      className="group relative flex flex-col items-stretch overflow-hidden rounded-[1.25rem] bg-[#050505] border border-white/[0.06] transition-all duration-500 hover:border-white/[0.2] hover:shadow-2xl active:scale-[0.98]"
      title={`Copy ${color}`}
    >
      <div 
        className="h-24 w-full transition-transform duration-700 group-hover:scale-110" 
        style={{ backgroundColor: color }} 
      />
      
      <div className="flex flex-col p-3.5 text-left bg-black relative overflow-hidden">
        {/* Decorative dynamic bg glow */}
        <div 
            className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity pointer-events-none"
            style={{ backgroundColor: color }}
        />
        
        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-1">{label || 'Hex Color'}</span>
        <div className="flex items-center justify-between">
          <span className="font-mono text-sm font-black text-white/90 uppercase tracking-tighter">{color}</span>
          <div className={`p-1.5 rounded-lg transition-all duration-300 ${copied ? 'bg-emerald-500/20 text-emerald-400' : 'text-zinc-700 group-hover:text-zinc-400'}`}>
            {copied ? <Check size={12} strokeWidth={3} /> : <Copy size={12} strokeWidth={3} />}
          </div>
        </div>
      </div>
      
      {/* Visual Feedback Overlay */}
      <div className={`absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-300 pointer-events-none ${copied ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`}>
           <span className="text-[10px] font-black text-white uppercase tracking-[0.3em] drop-shadow-xl">Copied!</span>
      </div>
    </button>
  );
}
