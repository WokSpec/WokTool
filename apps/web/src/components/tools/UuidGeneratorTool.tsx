'use client';

import { useState, useCallback } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function UuidGeneratorTool() {
  const [count, setCount] = useState(5);
  const [uuids, setUuids] = useState<string[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  const generate = useCallback(() => {
    const newUuids = Array.from({ length: count }, () => crypto.randomUUID());
    setUuids(newUuids);
  }, [count]);

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <Card title="Batch UUID Generator" description="Generate cryptographically strong UUID v4 strings instantly. All randomness is provided by your browser's local crypto API.">
        <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
                <Input 
                    label="Quantity"
                    type="number"
                    min={1} max={100}
                    value={count}
                    onChange={e => setCount(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
                />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
                <Button onClick={generate} className="flex-1 md:flex-none">Generate UUIDs</Button>
                {uuids.length > 0 && (
                    <Button variant="secondary" onClick={() => copy(uuids.join('\n'), 'all')}>
                        {copied === 'all' ? 'Copied List!' : 'Copy All'}
                    </Button>
                )}
            </div>
        </div>
      </Card>

      {uuids.length > 0 ? (
        <div className="space-y-3 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center px-1">
                <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">Generated Values</h3>
                <span className="text-[10px] font-bold text-accent uppercase tracking-tighter bg-accent/5 px-2 py-0.5 rounded border border-accent/10">v4 standard</span>
            </div>
            <div className="grid grid-cols-1 gap-2">
                {uuids.map((uuid, i) => (
                    <div key={i} className="group flex items-center justify-between p-4 rounded-xl bg-surface-raised border border-white/5 hover:border-white/10 transition-all">
                        <code className="text-sm font-mono text-white/80 select-all">{uuid}</code>
                        <button 
                            onClick={() => copy(uuid, uuid)}
                            className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase transition-all border ${copied === uuid ? 'bg-success border-success text-white' : 'bg-white/5 border-white/5 text-white/40 hover:text-white'}`}
                        >
                            {copied === uuid ? 'Copied' : 'Copy'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
      ) : (
        <div className="h-64 rounded-3xl border-2 border-dashed border-white/5 bg-white/[0.01] flex flex-col items-center justify-center text-center p-8 opacity-20">
            <div className="w-16 h-16 rounded-2xl bg-white/[0.03] flex items-center justify-center mb-4 text-2xl">🆔</div>
            <p className="text-sm font-medium">Click generate to create unique identifiers.</p>
        </div>
      )}
    </div>
  );
}
