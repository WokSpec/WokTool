'use client';

import { useState, useCallback, useMemo } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';

type Base = '2' | '8' | '10' | '16' | '32' | '36' | '64';
const BASES: { id: Base; label: string; prefix: string; chars: string }[] = [
  { id: '2',  label: 'Binary',      prefix: '0b', chars: '0-1' },
  { id: '8',  label: 'Octal',       prefix: '0o', chars: '0-7' },
  { id: '10', label: 'Decimal',     prefix: '',   chars: '0-9' },
  { id: '16', label: 'Hexadecimal', prefix: '0x', chars: '0-9, A-F' },
  { id: '32', label: 'Base32',      prefix: '',   chars: 'A-Z, 2-7' },
  { id: '36', label: 'Base36',      prefix: '',   chars: '0-9, A-Z' },
];

function convert(value: string, fromBase: Base): Record<string, string> | null {
  const clean = value.trim().replace(/^0[xXbBoO]/, '');
  if (!clean) return null;
  try {
    let n: number;
    if (fromBase === '64') {
        // Simple string to base64 isn't numeric conversion, usually people mean numeric base 64
        // But for standard bases we use parseInt
        return null;
    }
    n = parseInt(clean, parseInt(fromBase));
    if (isNaN(n)) return null;
    
    return {
      '2':  n.toString(2).toUpperCase(),
      '8':  n.toString(8).toUpperCase(),
      '10': n.toString(10),
      '16': n.toString(16).toUpperCase(),
      '32': n.toString(32).toUpperCase(),
      '36': n.toString(36).toUpperCase(),
    };
  } catch {
    return null;
  }
}

export default function BaseConverterTool() {
  const [value, setValue] = useState('255');
  const [fromBase, setFromBase] = useState<Base>('10');

  const result = useMemo(() => convert(value, fromBase), [value, fromBase]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
            <Card title="Input Value">
                <Input 
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    placeholder="Enter number to convert..."
                    className="font-mono text-lg"
                    spellCheck={false}
                />
            </Card>
        </div>
        <div>
            <Card title="Source Base">
                <Select 
                    value={fromBase}
                    onChange={e => setFromBase(e.target.value as Base)}
                    options={BASES.map(b => ({ value: b.id, label: `${b.label} (${b.id})` }))}
                />
            </Card>
        </div>
      </div>

      {value && !result && (
        <div className="p-4 rounded-xl bg-danger/10 border border-danger/20 text-danger text-sm font-medium">
            Invalid input for base {fromBase}. 
            <span className="block text-[10px] opacity-60 mt-1 uppercase tracking-wider">Expected characters: {BASES.find(b => b.id === fromBase)?.chars}</span>
        </div>
      )}

      {result ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {BASES.map(base => (
                <div key={base.id} className={`group relative p-5 rounded-2xl border transition-all ${
                    base.id === fromBase 
                        ? 'bg-accent/5 border-accent/30 shadow-inner' 
                        : 'bg-surface-raised border-white/5 hover:border-white/10'
                }`}>
                    <div className="flex justify-between items-start mb-3">
                        <div>
                            <div className="text-[10px] font-black text-white/20 uppercase tracking-widest">{base.label}</div>
                            <div className="text-[10px] font-mono text-accent/60">{base.prefix || `base ${base.id}`}</div>
                        </div>
                        <button 
                            onClick={() => navigator.clipboard.writeText(result[base.id])}
                            className="p-2 rounded-lg bg-white/5 text-white/20 hover:text-white hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                        </button>
                    </div>
                    <code className="text-lg font-bold text-white break-all block selection:bg-accent/30">
                        {result[base.id]}
                    </code>
                </div>
            ))}
        </div>
      ) : !value && (
        <div className="h-64 rounded-3xl border-2 border-dashed border-white/5 bg-white/[0.01] flex flex-col items-center justify-center text-center p-8 opacity-20">
            <p className="text-sm">Enter a numeric value above to see conversions</p>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
            { v: '255', b: '10' as Base, l: 'Decimal 255' },
            { v: 'FF', b: '16' as Base, l: 'Hex FF' },
            { v: '101010', b: '2' as Base, l: 'Binary 42' },
            { v: '777', b: '8' as Base, l: 'Octal 511' },
        ].map(ex => (
            <button 
                key={ex.l}
                onClick={() => { setValue(ex.v); setFromBase(ex.b); }}
                className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-[10px] font-bold text-white/40 uppercase hover:text-white hover:bg-white/5 transition-all"
            >
                {ex.l}
            </button>
        ))}
      </div>
    </div>
  );
}
