'use client';

import { useState, useMemo } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';

export default function RegexTesterTool() {
  const [pattern, setPattern] = useState('\\b\\w{5,}\\b');
  const [flags, setFlags] = useState('gi');
  const [input, setInput] = useState('The quick brown fox jumps over the lazy dog. Programming is amazing!');

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
        {/* Left: Configuration */}
        <div className="space-y-6">
            <Card title="Regex Pattern" description="Define your regular expression and flags.">
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
                        helper="g (global), i (insensitive), m (multiline)"
                    />
                </div>
            </Card>

            {result && !('error' in result) && (
                <div className="p-6 rounded-3xl bg-accent/5 border border-accent/10">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-black uppercase text-white/20 tracking-widest">Match Statistics</span>
                        <span className="text-xs font-bold text-accent">{result.count} Found</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-accent transition-all duration-500" style={{ width: result.count > 0 ? '100%' : '0%' }} />
                    </div>
                </div>
            )}
        </div>

        {/* Right: Input & Matches */}
        <div className="lg:col-span-2 space-y-6">
            <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">Test String</h3>
                    <Button variant="ghost" size="sm" onClick={() => setInput('')} className="h-7 text-[10px]">Clear</Button>
                </div>
                <Textarea 
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Enter text to test your regex against..."
                    className="min-h-[200px] font-mono text-sm leading-relaxed"
                />
            </div>

            <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 px-1">Results</h3>
                {result ? (
                    'error' in result ? (
                        <div className="p-4 rounded-xl bg-danger/10 border border-danger/20 text-danger text-xs font-mono">
                            {result.error}
                        </div>
                    ) : (
                        <Card className="bg-[#0d0d0d] border-white/10">
                            {result.matches.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {result.matches.map((m, i) => (
                                        <code key={i} className="px-2 py-1 rounded bg-accent/10 border border-accent/20 text-accent text-xs font-bold transition-all hover:scale-105">
                                            {m}
                                        </code>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-8 text-center text-white/20 text-sm italic">
                                    No matches found for the current pattern.
                                </div>
                            )}
                        </Card>
                    )
                ) : (
                    <div className="h-32 rounded-3xl border-2 border-dashed border-white/5 flex items-center justify-center text-white/20 text-sm">
                        Enter a pattern to see matches
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}
