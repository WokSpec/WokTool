'use client';

import { useState, useMemo } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';

const COMMON_PATTERNS = [
  { label: 'Email', p: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}' },
  { label: 'URL', p: 'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)' },
  { label: 'Phone', p: '\\+?\\d{1,4}?[-.\\s]?\\(?\\d{1,3}?\\)?[-.\\s]?\\d{1,4}[-.\\s]?\\d{1,4}[-.\\s]?\\d{1,9}' },
  { label: 'IPv4', p: '((25[0-5]|(2[0-4]|1\\d|[1-9]|)\\d)\\.?\\b){4}' },
  { label: 'Date (ISO)', p: '\\d{4}-\\d{2}-\\d{2}' },
];

export default function RegexTool() {
  const [pattern, setPattern] = useState('\\b\\w{5,}\\b');
  const [flags, setFlags] = useState('gi');
  const [input, setInput] = useState('Regex is a powerful language for matching text patterns. It is very useful for developers.');

  const result = useMemo(() => {
    if (!pattern) return null;
    try {
      const re = new RegExp(pattern, flags);
      const matches = [...input.matchAll(re)].map(m => m[0]);
      return { matches, count: matches.length };
    } catch (e: any) {
      return { error: e.message };
    }
  }, [pattern, flags, input]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
            <Card title="Regex Config">
                <div className="space-y-4">
                    <Input 
                        label="Pattern"
                        value={pattern}
                        onChange={e => setPattern(e.target.value)}
                        placeholder="\b\w+\b"
                        className="font-mono text-accent"
                        leftIcon={<span className="text-white/20">/</span>}
                        rightIcon={<span className="text-white/20">/</span>}
                    />
                    <Input 
                        label="Flags"
                        value={flags}
                        onChange={e => setFlags(e.target.value)}
                        placeholder="gi"
                        className="font-mono"
                    />
                </div>
            </Card>

            <Card title="Common Patterns">
                <div className="grid grid-cols-1 gap-2">
                    {COMMON_PATTERNS.map(cp => (
                        <button
                            key={cp.label}
                            onClick={() => setPattern(cp.p)}
                            className="flex items-center justify-between p-3 rounded-xl bg-surface-raised border border-white/5 hover:border-white/10 text-left transition-all group"
                        >
                            <span className="text-xs font-bold text-white/60 group-hover:text-white transition-colors">{cp.label}</span>
                            <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center text-[10px] text-white/20 group-hover:bg-accent group-hover:text-white transition-all">→</div>
                        </button>
                    ))}
                </div>
            </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
            <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">Test Content</h3>
                    <Button variant="ghost" size="sm" onClick={() => setInput('')} className="h-7 text-[10px]">Clear</Button>
                </div>
                <Textarea 
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    className="min-h-[200px] font-mono text-sm"
                />
            </div>

            <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 px-1">Live Matches</h3>
                {result ? (
                    'error' in result ? (
                        <div className="p-4 rounded-xl bg-danger/10 border border-danger/20 text-danger text-xs font-mono">
                            {result.error}
                        </div>
                    ) : (
                        <Card className="bg-[#0d0d0d] border-white/10">
                            <div className="flex flex-wrap gap-2">
                                {result.matches.length > 0 ? (
                                    result.matches.map((m, i) => (
                                        <code key={i} className="px-2 py-1 rounded bg-accent/10 border border-accent/20 text-accent text-xs font-bold">
                                            {m}
                                        </code>
                                    ))
                                ) : (
                                    <span className="text-white/20 italic text-sm py-4 w-full text-center">No matches found.</span>
                                )}
                            </div>
                        </Card>
                    )
                ) : (
                    <div className="h-32 rounded-3xl border-2 border-dashed border-white/5 bg-white/[0.01] flex items-center justify-center opacity-20">
                        Enter a pattern to scan text
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}
