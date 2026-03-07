'use client';

import { useState, useMemo } from 'react';
import Tabs from '@/components/ui/Tabs';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import CodeBlock from '@/components/ui/CodeBlock';

type Mode = 'case' | 'clean' | 'extract' | 'analyze';

const CASE_OPS = [
  { id: 'upper',  label: 'UPPER CASE',  fn: (s: string) => s.toUpperCase() },
  { id: 'lower',  label: 'lower case',  fn: (s: string) => s.toLowerCase() },
  { id: 'title',  label: 'Title Case',  fn: (s: string) => s.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()) },
  { id: 'camel',  label: 'camelCase',   fn: (s: string) => toSlug(s).replace(/-(\w)/g, (_, c) => c.toUpperCase()) },
  { id: 'pascal', label: 'PascalCase',  fn: (s: string) => { const c = toSlug(s).replace(/-(\w)/g, (_, c2) => c2.toUpperCase()); return c.charAt(0).toUpperCase() + c.slice(1); } },
  { id: 'snake',  label: 'snake_case',  fn: (s: string) => toSlug(s).replace(/-/g, '_') },
  { id: 'kebab',  label: 'kebab-case',  fn: (s: string) => toSlug(s) },
];

function toSlug(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export default function TextTool() {
  const [text, setText] = useState('');
  const [mode, setMode] = useState<Mode>('case');
  const [output, setOutput] = useState('');

  const stats = useMemo(() => {
    const chars = text.length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const lines = text ? text.split('\n').length : 0;
    const sentences = text.trim() ? (text.match(/[.!?]+/g) ?? []).length : 0;
    const paragraphs = text.trim() ? text.split(/\n\s*\n/).filter(Boolean).length : 0;
    return { chars, words, lines, sentences, paragraphs };
  }, [text]);

  const handleOp = (fn: (s: string) => string) => {
    if (!text.trim()) return;
    setOutput(fn(text));
  };

  const cleanText = (type: 'dedup' | 'trim' | 'empty' | 'spaces') => {
    if (!text.trim()) return;
    let result = '';
    switch (type) {
        case 'dedup':
            result = [...new Set(text.split('\n').map(l => l.trim()))].join('\n');
            break;
        case 'trim':
            result = text.split('\n').map(l => l.trim()).join('\n');
            break;
        case 'empty':
            result = text.split('\n').filter(l => l.trim()).join('\n');
            break;
        case 'spaces':
            result = text.replace(/\s+/g, ' ');
            break;
    }
    setOutput(result);
  };

  const extract = (type: 'emails' | 'urls' | 'numbers') => {
    if (!text.trim()) return;
    let matches: string[] = [];
    switch (type) {
        case 'emails':
            matches = text.match(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g) ?? [];
            break;
        case 'urls':
            matches = text.match(/https?:\/\/[^\s"'<>]+/g) ?? [];
            break;
        case 'numbers':
            matches = text.match(/\d+/g) ?? [];
            break;
    }
    setOutput([...new Set(matches)].join('\n') || 'No matches found.');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-center">
        <Tabs
          activeTab={mode}
          onChange={(id) => { setMode(id as Mode); setOutput(''); }}
          tabs={[
            { id: 'case', label: 'Transform Case', icon: 'Aa' },
            { id: 'clean', label: 'Clean Text', icon: '🧹' },
            { id: 'extract', label: 'Extract Data', icon: '🔍' },
            { id: 'analyze', label: 'Quick Stats', icon: '📊' },
          ]}
          className="w-full max-w-2xl"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Col: Input & Controls */}
        <div className="space-y-6">
            <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                    <label className="text-xs font-bold uppercase tracking-widest text-white/40">Input Text</label>
                    <Button variant="ghost" size="sm" onClick={() => { setText(''); setOutput(''); }} className="h-7 text-[10px]">Clear</Button>
                </div>
                <Textarea
                    value={text}
                    onChange={e => setText(e.target.value)}
                    placeholder="Paste or type text here..."
                    className="min-h-[300px] text-sm leading-relaxed"
                />
            </div>

            <Card title="Quick Actions">
                <div className="space-y-4">
                    {mode === 'case' && (
                        <div className="grid grid-cols-2 gap-2">
                            {CASE_OPS.map(op => (
                                <Button key={op.id} variant="secondary" size="sm" onClick={() => handleOp(op.fn)}>
                                    {op.label}
                                </Button>
                            ))}
                        </div>
                    )}

                    {mode === 'clean' && (
                        <div className="grid grid-cols-2 gap-2">
                            <Button variant="secondary" size="sm" onClick={() => cleanText('trim')}>Trim Lines</Button>
                            <Button variant="secondary" size="sm" onClick={() => cleanText('empty')}>Remove Empty Lines</Button>
                            <Button variant="secondary" size="sm" onClick={() => cleanText('dedup')}>Remove Duplicates</Button>
                            <Button variant="secondary" size="sm" onClick={() => cleanText('spaces')}>Collapse Spaces</Button>
                        </div>
                    )}

                    {mode === 'extract' && (
                        <div className="grid grid-cols-3 gap-2">
                            <Button variant="secondary" size="sm" onClick={() => extract('emails')}>Emails</Button>
                            <Button variant="secondary" size="sm" onClick={() => extract('urls')}>URLs</Button>
                            <Button variant="secondary" size="sm" onClick={() => extract('numbers')}>Numbers</Button>
                        </div>
                    )}

                    {mode === 'analyze' && (
                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                                <div className="text-[10px] font-bold text-white/30 uppercase mb-1">Words</div>
                                <div className="text-lg font-bold text-white">{stats.words}</div>
                            </div>
                            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                                <div className="text-[10px] font-bold text-white/30 uppercase mb-1">Characters</div>
                                <div className="text-lg font-bold text-white">{stats.chars}</div>
                            </div>
                            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                                <div className="text-[10px] font-bold text-white/30 uppercase mb-1">Lines</div>
                                <div className="text-lg font-bold text-white">{stats.lines}</div>
                            </div>
                            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                                <div className="text-[10px] font-bold text-white/30 uppercase mb-1">Sentences</div>
                                <div className="text-lg font-bold text-white">{stats.sentences}</div>
                            </div>
                        </div>
                    )}
                </div>
            </Card>
        </div>

        {/* Right Col: Output */}
        <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 px-1">Output</h3>
            {output ? (
                <div className="space-y-4 animate-in slide-in-from-right-4 duration-500">
                    <CodeBlock 
                        code={output} 
                        label="Processed Text" 
                        maxHeight="450px" 
                    />
                    <div className="flex gap-2">
                        <Button variant="primary" className="flex-1" onClick={() => navigator.clipboard.writeText(output)}>
                            Copy to Clipboard
                        </Button>
                        <Button variant="ghost" onClick={() => setOutput('')}>
                            Clear Result
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="h-[400px] rounded-3xl border-2 border-dashed border-white/5 bg-white/[0.01] flex flex-col items-center justify-center text-center p-8">
                    <div className="w-16 h-16 rounded-2xl bg-white/[0.03] flex items-center justify-center mb-4 text-2xl opacity-20">✍️</div>
                    <p className="text-sm text-white/20">The transformed text will appear here.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
