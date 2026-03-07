'use client';

import { useState, useMemo } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';

interface YearRow {
  year: number;
  balance: number;
  interest: number;
  contributions: number;
}

function calc(principal: number, rate: number, years: number, freq: number, monthly: number) {
  const r = rate / 100;
  const n = freq;
  const pmt = monthly * 12;
  const rows: YearRow[] = [];
  let balance = principal;
  let totalContrib = principal;

  for (let y = 1; y <= years; y++) {
    // Compound growth
    balance = balance * Math.pow(1 + r / n, n);
    // Contributions
    if (pmt > 0) {
      const growthFactor = Math.pow(1 + r / n, n);
      balance += (pmt / n) * ((growthFactor - 1) / (r / n));
    }
    totalContrib += pmt;
    rows.push({
      year: y,
      balance,
      interest: balance - totalContrib,
      contributions: totalContrib,
    });
  }
  return rows;
}

function cur(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}

const FREQS = [
  { label: 'Annually', value: 1 },
  { label: 'Semi-annually', value: 2 },
  { label: 'Quarterly', value: 4 },
  { label: 'Monthly', value: 12 },
  { label: 'Daily', value: 365 },
];

export default function CompoundInterestClient() {
  const [principal, setPrincipal] = useState('10000');
  const [rate, setRate] = useState('7');
  const [years, setYears] = useState('20');
  const [freq, setFreq] = useState(12);
  const [monthly, setMonthly] = useState('500');

  const p = parseFloat(principal) || 0;
  const r = parseFloat(rate) || 0;
  const y = Math.min(100, parseInt(years) || 0);
  const m = parseFloat(monthly) || 0;

  const rows = useMemo(() => calc(p, r, y, freq, m), [p, r, y, freq, m]);
  const final = rows[rows.length - 1];
  const maxVal = final?.balance || 1;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Settings */}
        <div className="space-y-6">
            <Card title="Investment Details">
                <div className="space-y-4">
                    <Input label="Initial Principal" type="number" value={principal} onChange={e => setPrincipal(e.target.value)} leftIcon={<span className="text-xs opacity-20">$</span>} />
                    <Input label="Annual Interest Rate" type="number" value={rate} onChange={e => setRate(e.target.value)} rightIcon={<span className="text-xs opacity-20">%</span>} />
                    <Input label="Time Period (Years)" type="number" value={years} onChange={e => setYears(e.target.value)} />
                </div>
            </Card>

            <Card title="Contributions">
                <div className="space-y-4">
                    <Input label="Monthly Addition" type="number" value={monthly} onChange={e => setMonthly(e.target.value)} leftIcon={<span className="text-xs opacity-20">$</span>} />
                    <Select 
                        label="Compounding Frequency"
                        value={freq}
                        onChange={e => setFreq(Number(e.target.value))}
                        options={FREQS}
                    />
                </div>
            </Card>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-8">
            {final && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-accent/5 border-accent/20">
                        <div className="text-[10px] font-black text-accent uppercase tracking-widest mb-1">Final Balance</div>
                        <div className="text-2xl font-black text-white">{cur(final.balance)}</div>
                    </Card>
                    <Card className="bg-success/5 border-success/20">
                        <div className="text-[10px] font-black text-success uppercase tracking-widest mb-1">Total Interest</div>
                        <div className="text-2xl font-black text-white">{cur(final.interest)}</div>
                    </Card>
                    <Card className="bg-white/5 border-white/10">
                        <div className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Total Contributed</div>
                        <div className="text-2xl font-black text-white">{cur(final.contributions)}</div>
                    </Card>
                </div>
            )}

            <Card title="Growth Projection">
                <div className="space-y-6">
                    <div className="relative h-64 w-full flex items-end gap-1 px-2">
                        {rows.map((row, i) => (
                            <div 
                                key={i} 
                                className="group relative flex-1 bg-accent/20 hover:bg-accent transition-all rounded-t-sm"
                                style={{ height: `${(row.balance / maxVal) * 100}%` }}
                            >
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                                    <div className="bg-black/80 backdrop-blur-md border border-white/10 p-2 rounded-lg text-[10px] whitespace-nowrap shadow-2xl">
                                        <div className="font-bold text-white">Year {row.year}</div>
                                        <div className="text-accent">{cur(row.balance)}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between text-[10px] font-bold text-white/20 uppercase tracking-widest px-2">
                        <span>Start</span>
                        <span>Year {y}</span>
                    </div>
                </div>
            </Card>

            <div className="overflow-x-auto rounded-3xl border border-white/10 bg-[#0d0d0d]">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white/[0.02]">
                            <th className="p-4 text-[10px] font-black uppercase text-white/20 tracking-widest">Year</th>
                            <th className="p-4 text-[10px] font-black uppercase text-white/20 tracking-widest">Total Contributions</th>
                            <th className="p-4 text-[10px] font-black uppercase text-white/20 tracking-widest">Total Interest</th>
                            <th className="p-4 text-[10px] font-black uppercase text-white/20 tracking-widest text-right">Balance</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.03]">
                        {rows.map(row => (
                            <tr key={row.year} className="hover:bg-white/[0.01] transition-colors">
                                <td className="p-4 text-xs font-bold text-white/40">{row.year}</td>
                                <td className="p-4 text-xs font-medium text-white/60">{cur(row.contributions)}</td>
                                <td className="p-4 text-xs font-medium text-success/80">{cur(row.interest)}</td>
                                <td className="p-4 text-xs font-bold text-accent text-right">{cur(row.balance)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    </div>
  );
}
