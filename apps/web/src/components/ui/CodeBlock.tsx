'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
  label?: string;
  maxHeight?: string;
}

export default function CodeBlock({ code, language = 'text', label, maxHeight = '400px' }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group rounded-2xl overflow-hidden bg-[#0d0d0d] border border-white/[0.08] shadow-2xl">
      <div className="flex items-center justify-between px-5 py-2.5 bg-white/[0.03] border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          {label && <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">{label}</span>}
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-accent font-mono uppercase font-bold">{language}</span>
        </div>
        <button
          onClick={handleCopy}
          className={`
            text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg transition-all flex items-center gap-2
            ${copied ? 'text-emerald-400 bg-emerald-500/10' : 'text-zinc-500 hover:text-white hover:bg-white/5'}
          `}
        >
          {copied ? <Check size={12} strokeWidth={3} /> : <Copy size={12} strokeWidth={2} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="overflow-auto custom-scrollbar" style={{ maxHeight }}>
        <pre className="p-6 font-mono text-[13px] text-zinc-300 leading-relaxed whitespace-pre-wrap break-all selection:bg-accent/30 selection:text-white">
          {code}
        </pre>
      </div>
    </div>
  );
}
