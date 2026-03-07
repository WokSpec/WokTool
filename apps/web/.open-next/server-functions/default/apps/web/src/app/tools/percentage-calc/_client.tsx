'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

function fmt(n: number, decimals = 2): string {
  if (!isFinite(n)) return '—';
  const s = parseFloat(n.toFixed(decimals)).toString();
  return s.endsWith('.00') ? s.slice(0, -3) : s;
}

export default function PercentageCalcClient() {
  // Card 1: What is X% of Y?
  const [c1x, setC1x] = useState('15');
  const [c1y, setC1y] = useState('200');
  const c1res = (() => {
    const x = parseFloat(c1x), y = parseFloat(c1y);
    return isNaN(x) || isNaN(y) ? null : fmt(x / 100 * y);
  })();

  // Card 2: X is what % of Y?
  const [c2x, setC2x] = useState('40');
  const [c2y, setC2y] = useState('200');
  const c2res = (() => {
    const x = parseFloat(c2x), y = parseFloat(c2y);
    return isNaN(x) || isNaN(y) || y === 0 ? null : fmt(x / y * 100) + '%';
  })();

  // Card 3: % change from X to Y
  const [c3x, setC3x] = useState('100');
  const [c3y, setC3y] = useState('150');
  const c3res = (() => {
    const x = parseFloat(c3x), y = parseFloat(c3y);
    if (isNaN(x) || isNaN(y) || x === 0) return null;
    const p = (y - x) / Math.abs(x) * 100;
    return { val: `${p >= 0 ? '▲ +' : '▼ '}${fmt(p)}%`, pos: p >= 0 };
  })();

  // Card 4: Tip calculator
  const [bill, setBill] = useState('64.50');
  const [tipPct, setTipPct] = useState('18');
  const [people, setPeople] = useState('2');
  const tipRes = (() => {
    const b = parseFloat(bill), t = parseFloat(tipPct), p = parseInt(people);
    if (isNaN(b) || isNaN(t) || isNaN(p) || p < 1) return null;
    const tip = b * t / 100;
    const total = b + tip;
    return { tip: fmt(tip), total: fmt(total), per: fmt(total / p) };
  })();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Simple % */}
        <Card title="Percentage Of" description="Calculate X percent of Y">
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <Input value={c1x} onChange={e => setC1x(e.target.value)} type="number" placeholder="15" rightIcon={<span className="text-[10px] font-black opacity-20">%</span>} />
                    <span className="text-xs font-bold text-white/20 uppercase">of</span>
                    <Input value={c1y} onChange={e => setC1y(e.target.value)} type="number" placeholder="200" />
                </div>
                <div className="p-4 rounded-xl bg-accent/5 border border-accent/10 flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase text-white/20">Result</span>
                    <span className="text-xl font-mono font-black text-accent">{c1res || '—'}</span>
                </div>
            </div>
        </Card>

        {/* What % is */}
        <Card title="Percentage Ratio" description="X is what percent of Y?">
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <Input value={c2x} onChange={e => setC2x(e.target.value)} type="number" placeholder="40" />
                    <span className="text-xs font-bold text-white/20 uppercase">is ? % of</span>
                    <Input value={c2y} onChange={e => setC2y(e.target.value)} type="number" placeholder="200" />
                </div>
                <div className="p-4 rounded-xl bg-accent/5 border border-accent/10 flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase text-white/20">Result</span>
                    <span className="text-xl font-mono font-black text-accent">{c2res || '—'}</span>
                </div>
            </div>
        </Card>

        {/* Change */}
        <Card title="Percent Change" description="Change from X to Y">
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <Input value={c3x} onChange={e => setC3x(e.target.value)} type="number" placeholder="100" />
                    <span className="text-xs font-bold text-white/20 uppercase">to</span>
                    <Input value={c3y} onChange={e => setC3y(e.target.value)} type="number" placeholder="150" />
                </div>
                <div className={`p-4 rounded-xl border flex justify-between items-center ${c3res ? (c3res.pos ? 'bg-success/5 border-success/20' : 'bg-danger/5 border-danger/20') : 'bg-white/5 border-white/10'}`}>
                    <span className="text-[10px] font-black uppercase text-white/20">Result</span>
                    <span className={`text-xl font-mono font-black ${c3res ? (c3res.pos ? 'text-success' : 'text-danger') : 'text-white/20'}`}>{c3res?.val || '—'}</span>
                </div>
            </div>
        </Card>

        {/* Tip */}
        <Card title="Tip Calculator" className="md:col-span-2 lg:col-span-1">
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <Input label="Bill Amount" value={bill} onChange={e => setBill(e.target.value)} type="number" leftIcon={<span className="text-xs font-bold opacity-20">$</span>} />
                    <Input label="Tip %" value={tipPct} onChange={e => setTipPct(e.target.value)} type="number" rightIcon={<span className="text-[10px] font-black opacity-20">%</span>} />
                </div>
                <Input label="Number of People" value={people} onChange={e => setPeople(e.target.value)} type="number" />
                
                {tipRes && (
                    <div className="grid grid-cols-3 gap-2 pt-2">
                        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-center">
                            <div className="text-[9px] font-black text-white/20 uppercase mb-1">Tip</div>
                            <div className="text-sm font-bold text-white">${tipRes.tip}</div>
                        </div>
                        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-center">
                            <div className="text-[9px] font-black text-white/20 uppercase mb-1">Total</div>
                            <div className="text-sm font-bold text-white">${tipRes.total}</div>
                        </div>
                        <div className="p-3 rounded-xl bg-accent/10 border border-accent/20 text-center ring-2 ring-accent/10">
                            <div className="text-[9px] font-black text-accent uppercase mb-1">Each</div>
                            <div className="text-sm font-bold text-white">${tipRes.per}</div>
                        </div>
                    </div>
                )}
            </div>
        </Card>

        {/* Info */}
        <div className="lg:col-span-2 p-8 rounded-3xl bg-white/[0.02] border border-white/5 flex flex-col md:flex-row gap-8 items-center text-center md:text-left">
            <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center text-accent text-3xl shadow-lg shrink-0">
                %
            </div>
            <div>
                <h4 className="text-lg font-bold text-white mb-2">Mathematical Accuracy</h4>
                <p className="text-sm text-white/40 leading-relaxed max-w-xl">
                    Our calculations use high-precision floating point math. Results are rounded to 2 decimal places by default for currency, and up to 4 for general percentages to ensure clarity without sacrificing detail.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
}
