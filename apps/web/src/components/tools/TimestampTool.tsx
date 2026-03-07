'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function TimestampTool() {
  const [now, setNow] = useState(new Date());
  const [ts, setTs] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const onCopy = (val: string, key: string) => {
    navigator.clipboard.writeText(val);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  const parsed = (() => {
    if (!ts.trim()) return null;
    const n = Number(ts);
    if (isNaN(n)) return null;
    // Guess seconds vs ms
    const d = new Date(ts.length <= 10 ? n * 1000 : n);
    if (isNaN(d.getTime())) return null;
    return d;
  })();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Real-time Clock */}
        <div className="space-y-6">
            <Card title="Current System Time" description="Real-time precision clock with one-click copy for all common formats.">
                <div className="space-y-4">
                    <div className="p-8 rounded-3xl bg-accent/5 border border-accent/10 flex flex-col items-center justify-center text-center">
                        <div className="text-[10px] font-black uppercase text-accent tracking-[0.2em] mb-2">Live Unix Epoch</div>
                        <div className="text-4xl font-black text-white font-mono tracking-tighter">
                            {Math.floor(now.getTime() / 1000)}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                        {[
                            { l: 'ISO 8601', v: now.toISOString() },
                            { l: 'RFC 2822', v: now.toUTCString() },
                            { l: 'Local Time', v: now.toLocaleString() },
                            { l: 'Milliseconds', v: String(now.getTime()) },
                        ].map(item => (
                            <div key={item.l} className="group flex items-center justify-between p-4 rounded-xl bg-surface-raised border border-white/5 hover:border-white/10 transition-all">
                                <div>
                                    <div className="text-[10px] font-black uppercase text-white/20 tracking-widest">{item.l}</div>
                                    <code className="text-sm font-bold text-white/80">{item.v}</code>
                                </div>
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => onCopy(item.v, item.l)}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    {copied === item.l ? 'Copied' : 'Copy'}
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </Card>
        </div>

        {/* Converter */}
        <div className="space-y-6">
            <Card title="Time Converter" description="Translate Unix timestamps into human-readable dates or vice versa.">
                <div className="space-y-6">
                    <Input 
                        label="Unix Timestamp"
                        value={ts}
                        onChange={e => setTs(e.target.value)}
                        placeholder="e.g. 1709760000"
                        className="font-mono text-lg font-black text-accent"
                        helper="Paste a 10-digit (seconds) or 13-digit (ms) value"
                    />

                    {parsed ? (
                        <div className="space-y-4 animate-in slide-in-from-top-2">
                            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 space-y-4">
                                <div>
                                    <div className="text-[10px] font-black uppercase text-white/20 tracking-widest mb-1">Interpreted Date</div>
                                    <div className="text-lg font-bold text-white leading-tight">{parsed.toUTCString()}</div>
                                    <div className="text-xs font-medium text-white/40 mt-1">{parsed.toLocaleString()} (Local)</div>
                                </div>
                                
                                <div className="pt-4 border-t border-white/5 grid grid-cols-2 gap-4">
                                    <div>
                                        <div className="text-[9px] font-black uppercase text-white/20">Relative</div>
                                        <div className="text-xs font-bold text-accent">...coming soon</div>
                                    </div>
                                    <div>
                                        <div className="text-[9px] font-black uppercase text-white/20">Timezone</div>
                                        <div className="text-xs font-bold text-white/60">UTC+0</div>
                                    </div>
                                </div>
                            </div>
                            <Button variant="primary" className="w-full" onClick={() => onCopy(parsed.toISOString(), 'conv')}>Copy ISO String</Button>
                        </div>
                    ) : ts.trim() && (
                        <div className="p-4 rounded-xl bg-danger/10 border border-danger/20 text-danger text-xs font-medium italic">
                            Invalid timestamp format. Please provide a valid numeric epoch.
                        </div>
                    )}
                </div>
            </Card>

            <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 opacity-40">
                <h4 className="text-xs font-bold text-white mb-2 uppercase tracking-widest">About Unix Time</h4>
                <p className="text-[11px] text-white/40 leading-relaxed">
                    Unix time (also known as Epoch time) is a system for describing a point in time. It is the number of seconds that have elapsed since the Unix epoch, minus leap seconds; the Unix epoch is 00:00:00 UTC on 1 January 1970.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
}
