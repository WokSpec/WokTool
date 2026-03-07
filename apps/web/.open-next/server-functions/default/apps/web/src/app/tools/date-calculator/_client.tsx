'use client';

import { useState, useMemo } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import Tabs from '@/components/ui/Tabs';

type Mode = 'age' | 'diff' | 'add' | 'week';

function diffDays(d1: Date, d2: Date) {
  return Math.floor(Math.abs(d1.getTime() - d2.getTime()) / (1000 * 60 * 60 * 24));
}

function formatDate(d: Date) {
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });
}

export default function DateCalculatorClient() {
  const [activeTab, setActiveTab] = useState<Mode>('age');

  // Age state
  const [dob, setDob] = useState('1995-01-01');
  const age = useMemo(() => {
    const birth = new Date(dob);
    if (isNaN(birth.getTime())) return null;
    const now = new Date();
    let years = now.getFullYear() - birth.getFullYear();
    const m = now.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) years--;
    const days = diffDays(birth, now);
    return { years, days, next: new Date(now.getFullYear() + (m < 0 || (m===0 && now.getDate()<birth.getDate()) ? 0 : 1), birth.getMonth(), birth.getDate()) };
  }, [dob]);

  // Diff state
  const [d1, setD1] = useState(new Date().toISOString().split('T')[0]);
  const [d2, setD2] = useState(new Date().toISOString().split('T')[0]);
  const diff = useMemo(() => {
    const a = new Date(d1), b = new Date(d2);
    if (isNaN(a.getTime()) || isNaN(b.getTime())) return null;
    const days = diffDays(a, b);
    return { days, weeks: (days / 7).toFixed(1), months: (days / 30.44).toFixed(1), years: (days / 365.25).toFixed(1) };
  }, [d1, d2]);

  // Add state
  const [base, setBase] = useState(new Date().toISOString().split('T')[0]);
  const [amount, setAmount] = useState('30');
  const [unit, setUnit] = useState('days');
  const [op, setOp] = useState<'add' | 'sub'>('add');
  const added = useMemo(() => {
    const d = new Date(base);
    const amt = parseInt(amount) || 0;
    const factor = op === 'add' ? 1 : -1;
    if (unit === 'days') d.setDate(d.getDate() + amt * factor);
    else if (unit === 'weeks') d.setDate(d.getDate() + amt * 7 * factor);
    else if (unit === 'months') d.setMonth(d.getMonth() + amt * factor);
    else if (unit === 'years') d.setFullYear(d.getFullYear() + amt * factor);
    return isNaN(d.getTime()) ? null : d;
  }, [base, amount, unit, op]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-center">
        <Tabs 
            activeTab={activeTab}
            onChange={id => setActiveTab(id as Mode)}
            tabs={[
                { id: 'age', label: 'Age', icon: '🎂' },
                { id: 'diff', label: 'Difference', icon: '↔️' },
                { id: 'add', label: 'Add/Sub', icon: '➕' },
            ]}
            className="w-full max-w-sm"
        />
      </div>

      <div className="max-w-2xl mx-auto min-h-[400px]">
        {activeTab === 'age' && (
            <div className="space-y-6 animate-in slide-in-from-bottom-2">
                <Card title="Birthday Calculator">
                    <div className="space-y-6">
                        <Input label="Date of Birth" type="date" value={dob} onChange={e => setDob(e.target.value)} />
                        {age && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-6 rounded-2xl bg-accent/5 border border-accent/10 flex flex-col items-center text-center">
                                    <div className="text-[10px] font-black uppercase text-accent tracking-widest mb-1">Current Age</div>
                                    <div className="text-4xl font-black text-white">{age.years} <span className="text-sm text-white/40">Years</span></div>
                                </div>
                                <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 flex flex-col items-center text-center">
                                    <div className="text-[10px] font-black uppercase text-white/20 tracking-widest mb-1">Total Lived</div>
                                    <div className="text-xl font-bold text-white">{age.days.toLocaleString()} <span className="text-xs text-white/40 uppercase">Days</span></div>
                                </div>
                            </div>
                        )}
                    </div>
                </Card>
                {age && (
                    <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 flex justify-between items-center px-8">
                        <span className="text-xs font-bold text-white/40 uppercase">Next Birthday</span>
                        <span className="text-sm font-bold text-white/80">{formatDate(age.next)}</span>
                    </div>
                )}
            </div>
        )}

        {activeTab === 'diff' && (
            <div className="space-y-6 animate-in slide-in-from-bottom-2">
                <Card title="Time Between Dates">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <Input label="Start Date" type="date" value={d1} onChange={e => setD1(e.target.value)} />
                        <Input label="End Date" type="date" value={d2} onChange={e => setD2(e.target.value)} />
                    </div>
                    {diff && (
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { l: 'Days', v: diff.days },
                                { l: 'Weeks', v: diff.weeks },
                                { l: 'Months', v: diff.months },
                                { l: 'Years', v: diff.years },
                            ].map(i => (
                                <div key={i.l} className="p-4 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col items-center">
                                    <div className="text-[9px] font-black text-white/20 uppercase mb-1">{i.l}</div>
                                    <div className="text-xl font-black text-accent">{i.v}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
            </div>
        )}

        {activeTab === 'add' && (
            <div className="space-y-6 animate-in slide-in-from-bottom-2">
                <Card title="Time Shifting">
                    <div className="space-y-6">
                        <Input label="Start Date" type="date" value={base} onChange={e => setBase(e.target.value)} />
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                            <div className="md:col-span-1">
                                <label className="text-[10px] font-black uppercase text-white/20 tracking-widest px-1 mb-2 block">Action</label>
                                <div className="flex bg-white/5 p-1 rounded-xl">
                                    <button onClick={() => setOp('add')} className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold ${op === 'add' ? 'bg-accent text-white shadow-md' : 'text-white/30'}`}>Add</button>
                                    <button onClick={() => setOp('sub')} className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold ${op === 'sub' ? 'bg-accent text-white shadow-md' : 'text-white/30'}`}>Sub</button>
                                </div>
                            </div>
                            <Input label="Amount" type="number" value={amount} onChange={e => setAmount(e.target.value)} />
                            <Select 
                                label="Unit" 
                                value={unit} 
                                onChange={e => setUnit(e.target.value)}
                                options={[
                                    { value: 'days', label: 'Days' },
                                    { value: 'weeks', label: 'Weeks' },
                                    { value: 'months', label: 'Months' },
                                    { value: 'years', label: 'Years' },
                                ]}
                            />
                        </div>

                        {added && (
                            <div className="p-8 rounded-3xl bg-accent/5 border border-accent/10 flex flex-col items-center text-center space-y-2">
                                <div className="text-[10px] font-black uppercase text-accent tracking-[0.2em]">Calculated Date</div>
                                <div className="text-2xl font-black text-white">{formatDate(added)}</div>
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        )}
      </div>
    </div>
  );
}
