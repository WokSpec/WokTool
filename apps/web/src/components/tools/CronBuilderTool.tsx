'use client';

import { useState, useCallback, useMemo } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

const PRESETS = [
  { label: 'Every minute',  value: '* * * * *' },
  { label: 'Every hour',    value: '0 * * * *' },
  { label: 'Every day',     value: '0 0 * * *' },
  { label: 'Every week',    value: '0 0 * * 0' },
  { label: 'Every month',   value: '0 0 1 * *' },
];

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function describePart(val: string, unit: string, names?: string[], offset = 0): string {
  if (val === '*') return `every ${unit}`;
  if (val.startsWith('*/')) return `every ${val.slice(2)} ${unit}s`;
  if (val.includes(',')) {
    const parts = val.split(',').map(v => names ? names[parseInt(v) - offset] ?? v : v);
    return parts.join(', ');
  }
  if (val.includes('-')) {
    const [a, b] = val.split('-');
    const na = names ? names[parseInt(a) - offset] ?? a : a;
    const nb = names ? names[parseInt(b) - offset] ?? b : b;
    return `${na} to ${nb}`;
  }
  return names ? names[parseInt(val) - offset] ?? val : val;
}

function describeExpression(expr: string): string {
  const rawParts = expr.trim().split(/\s+/);
  if (rawParts.length !== 5 && rawParts.length !== 6) return 'Invalid expression';
  const parts = rawParts.length === 6 ? rawParts.slice(1) : rawParts;
  const [min, hr, dom, mon, dow] = parts;
  const phrases: string[] = [];
  if (min !== '*') phrases.push(`at minute ${describePart(min, 'minute')}`);
  if (hr  !== '*') phrases.push(`at hour ${describePart(hr, 'hour')}`);
  if (dom !== '*') phrases.push(`on day ${describePart(dom, 'day')} of the month`);
  if (mon !== '*') phrases.push(`in ${describePart(mon, 'month', MONTHS, 1)}`);
  if (dow !== '*') phrases.push(`on ${describePart(dow, 'weekday', WEEKDAYS)}`);
  if (phrases.length === 0) return 'Every minute';
  return phrases.join(', ');
}

export default function CronBuilderTool() {
  const [expr, setExpr] = useState('0 9 * * 1-5');
  const parts = useMemo(() => {
    const p = expr.trim().split(/\s+/);
    return Array.from({ length: 5 }, (_, i) => p[i] ?? '*');
  }, [expr]);

  const description = useMemo(() => describeExpression(expr), [expr]);

  const setPart = (idx: number, val: string) => {
    const next = [...parts];
    next[idx] = val || '*';
    setExpr(next.join(' '));
  };

  const FIELDS = ['Minute', 'Hour', 'Day', 'Month', 'Weekday'];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Editor */}
        <div className="lg:col-span-2 space-y-6">
            <Card title="Expression Builder">
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                    {FIELDS.map((label, i) => (
                        <div key={label} className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-white/20 tracking-widest px-1">{label}</label>
                            <input
                                className="w-full bg-[#0d0d0d] border border-white/10 rounded-xl px-3 py-2 text-center font-mono text-sm text-accent focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                                value={parts[i]}
                                onChange={e => setPart(i, e.target.value)}
                                spellCheck={false}
                            />
                        </div>
                    ))}
                </div>
            </Card>

            <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">Manual Override</h3>
                    <Button variant="ghost" size="sm" onClick={() => setExpr('* * * * *')} className="h-7 text-[10px]">Reset</Button>
                </div>
                <Input 
                    value={expr}
                    onChange={e => setExpr(e.target.value)}
                    className="text-lg font-mono font-black tracking-widest text-center"
                    spellCheck={false}
                />
            </div>

            <div className="p-8 rounded-3xl bg-accent/5 border border-accent/10 flex flex-col items-center text-center space-y-4">
                <div className="text-[10px] font-black uppercase text-accent tracking-[0.2em]">Human Readable</div>
                <p className="text-lg font-bold text-white leading-relaxed max-w-lg">&ldquo;{description}&rdquo;</p>
            </div>
        </div>

        {/* Sidebar: Presets */}
        <div className="space-y-6">
            <Card title="Quick Presets">
                <div className="grid grid-cols-1 gap-2">
                    {PRESETS.map(p => (
                        <button
                            key={p.value}
                            onClick={() => setExpr(p.value)}
                            className={`flex flex-col items-start p-3 rounded-xl border transition-all ${expr === p.value ? 'bg-accent/10 border-accent/30 shadow-inner' : 'bg-surface-raised border-white/5 text-white/40 hover:text-white hover:bg-white/[0.02]'}`}
                        >
                            <span className="text-xs font-bold text-white/80">{p.label}</span>
                            <code className="text-[10px] font-mono text-accent opacity-60 mt-1">{p.value}</code>
                        </button>
                    ))}
                </div>
            </Card>

            <Button variant="primary" size="lg" className="w-full" onClick={() => navigator.clipboard.writeText(expr)}>
                Copy Expression
            </Button>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                <h4 className="text-[10px] font-black uppercase text-white/20 tracking-widest mb-2">Ref Syntax</h4>
                <div className="space-y-2 text-[10px] text-white/40 font-medium">
                    <div className="flex justify-between"><span>*</span> <span>any value</span></div>
                    <div className="flex justify-between"><span>,</span> <span>value list separator</span></div>
                    <div className="flex justify-between"><span>-</span> <span>range of values</span></div>
                    <div className="flex justify-between"><span>/</span> <span>step values</span></div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
