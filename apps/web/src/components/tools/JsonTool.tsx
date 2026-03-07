'use client';

import { useState, useCallback } from 'react';
import Tabs from '@/components/ui/Tabs';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import CodeBlock from '@/components/ui/CodeBlock';
import Card from '@/components/ui/Card';

type Mode = 'format' | 'minify' | 'validate' | 'convert';

interface ConvertTarget {
  id: string;
  label: string;
  convert: (obj: unknown) => string;
}

const CONVERT_TARGETS: ConvertTarget[] = [
  {
    id: 'yaml',
    label: 'YAML',
    convert: (obj) => toYaml(obj, 0),
  },
  {
    id: 'csv',
    label: 'CSV (Array only)',
    convert: (obj) => {
      if (!Array.isArray(obj)) return 'Error: Input must be a JSON array of objects for CSV conversion.';
      if (obj.length === 0) return '';
      const keys = Object.keys(obj[0] as object);
      const rows = [keys.join(',')];
      for (const row of obj as Record<string, unknown>[]) {
        rows.push(keys.map(k => {
          const v = String(row[k] ?? '');
          return v.includes(',') || v.includes('"') || v.includes('\n')
            ? `"${v.replace(/"/g, '""')}"`
            : v;
        }).join(','));
      }
      return rows.join('\n');
    },
  },
  {
    id: 'tsv',
    label: 'TSV (Array only)',
    convert: (obj) => {
      if (!Array.isArray(obj)) return 'Error: Input must be a JSON array of objects for TSV conversion.';
      if (obj.length === 0) return '';
      const keys = Object.keys(obj[0] as object);
      const rows = [keys.join('\t')];
      for (const row of obj as Record<string, unknown>[]) {
        rows.push(keys.map(k => String((row as Record<string, unknown>)[k] ?? '')).join('\t'));
      }
      return rows.join('\n');
    },
  },
];

function toYaml(obj: unknown, depth: number): string {
  const indent = '  '.repeat(depth);
  if (obj === null) return 'null';
  if (typeof obj === 'boolean') return String(obj);
  if (typeof obj === 'number') return String(obj);
  if (typeof obj === 'string') {
    if (obj.includes('\n') || obj.includes(':') || obj.includes('#')) {
      return `"${obj.replace(/"/g, '\\"')}"`;
    }
    return obj;
  }
  if (Array.isArray(obj)) {
    if (obj.length === 0) return '[]';
    return obj.map(item => {
      const v = toYaml(item, depth + 1);
      return `\n${indent}- ${v}`;
    }).join('');
  }
  if (typeof obj === 'object') {
    const entries = Object.entries(obj as Record<string, unknown>);
    if (entries.length === 0) return '{}';
    return entries.map(([k, v]) => {
      const val = toYaml(v, depth + 1);
      if (typeof v === 'object' && v !== null) {
        return `\n${indent}${k}:${val}`;
      }
      return `\n${indent}${k}: ${val}`;
    }).join('');
  }
  return String(obj);
}

export default function JsonTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<Mode>('format');
  const [convertTarget, setConvertTarget] = useState<string>('yaml');
  const [error, setError] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<unknown>(null);

  const run = useCallback(() => {
    if (!input.trim()) {
      setError('Please enter some JSON content first.');
      setOutput('');
      return;
    }
    try {
      const parsed = JSON.parse(input);
      setError(null);
      setParsedData(parsed);

      if (mode === 'format') {
        setOutput(JSON.stringify(parsed, null, 2));
      } else if (mode === 'minify') {
        setOutput(JSON.stringify(parsed));
      } else if (mode === 'validate') {
        const depth = countDepth(parsed);
        const keys = countKeys(parsed);
        setOutput(
          `Valid JSON Detected\n\nStructure: ${Array.isArray(parsed) ? `Array (${(parsed as unknown[]).length} items)` : 'Object'}\nTotal Keys: ${keys}\nMax Depth: ${depth}\nSize: ${input.length} characters`
        );
      } else if (mode === 'convert') {
        const target = CONVERT_TARGETS.find(t => t.id === convertTarget);
        if (!target) return;
        setOutput(target.convert(parsed));
      }
    } catch (e) {
      if (e instanceof SyntaxError) {
        setError(`Syntax Error: ${e.message}`);
      } else {
        setError(`Error: ${String(e)}`);
      }
      setParsedData(null);
      setOutput('');
    }
  }, [input, mode, convertTarget]);

  const loadExample = () => {
    const example = {
      project: "WokTool",
      version: "2.5.0",
      active: true,
      stats: { tools: 100, contributors: 12 },
      tags: ["Open Source", "Utilities", "Web-based"]
    };
    setInput(JSON.stringify(example, null, 2));
    setError(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-center">
        <Tabs
          activeTab={mode}
          onChange={(id) => { setMode(id as Mode); setOutput(''); setError(null); }}
          tabs={[
            { id: 'format', label: 'Format', icon: '✨' },
            { id: 'minify', label: 'Minify', icon: '📦' },
            { id: 'validate', label: 'Validate', icon: '✅' },
            { id: 'convert', label: 'Convert', icon: '🔄' },
          ]}
          className="w-full max-w-2xl"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Col: Input */}
        <div className="space-y-4">
            <div className="flex justify-between items-center px-1">
                <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">JSON Input</h3>
                <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={loadExample} className="h-7 text-[10px]">Load Example</Button>
                    <Button variant="ghost" size="sm" onClick={() => { setInput(''); setOutput(''); setError(null); }} className="h-7 text-[10px]">Clear</Button>
                </div>
            </div>
            
            <Textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder='{"key": "value"}'
                className={`min-h-[400px] font-mono text-xs leading-relaxed ${error ? 'border-danger/50' : ''}`}
                spellCheck={false}
            />
            
            {error && (
                <div className="p-4 rounded-xl bg-danger/10 border border-danger/20 text-danger text-xs font-medium animate-in slide-in-from-top-2">
                    {error}
                </div>
            )}

            {mode === 'convert' && (
                <Card title="Conversion Options">
                    <Select
                        label="Target Format"
                        value={convertTarget}
                        onChange={e => setConvertTarget(e.target.value)}
                        options={CONVERT_TARGETS.map(t => ({ value: t.id, label: t.label }))}
                    />
                </Card>
            )}

            <Button onClick={run} size="lg" className="w-full" variant="primary">
                {mode === 'format' ? 'Prettify JSON' : mode === 'minify' ? 'Minify JSON' : mode === 'validate' ? 'Validate Structure' : `Convert to ${convertTarget.toUpperCase()}`}
            </Button>
        </div>

        {/* Right Col: Output */}
        <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 px-1">Result</h3>
            {output ? (
                <div className="space-y-6">
                    <CodeBlock 
                        code={output} 
                        language={mode === 'convert' ? convertTarget : 'json'} 
                        maxHeight="450px" 
                    />
                    
                    {parsedData !== null && mode !== 'validate' && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <Card className="p-3 text-center border-white/5 bg-white/[0.01]">
                                <div className="text-[10px] font-bold text-white/30 uppercase mb-1">Type</div>
                                <div className="text-xs font-bold text-white/70">{Array.isArray(parsedData) ? 'Array' : 'Object'}</div>
                            </Card>
                            <Card className="p-3 text-center border-white/5 bg-white/[0.01]">
                                <div className="text-[10px] font-bold text-white/30 uppercase mb-1">Items/Keys</div>
                                <div className="text-xs font-bold text-white/70">
                                    {Array.isArray(parsedData) ? parsedData.length : Object.keys(parsedData as object).length}
                                </div>
                            </Card>
                            <Card className="p-3 text-center border-white/5 bg-white/[0.01]">
                                <div className="text-[10px] font-bold text-white/30 uppercase mb-1">Lines</div>
                                <div className="text-xs font-bold text-white/70">{output.split('\n').length}</div>
                            </Card>
                            <Card className="p-3 text-center border-white/5 bg-white/[0.01]">
                                <div className="text-[10px] font-bold text-white/30 uppercase mb-1">Size</div>
                                <div className="text-xs font-bold text-white/70">{output.length} ch</div>
                            </Card>
                        </div>
                    )}
                </div>
            ) : (
                <div className="h-[400px] rounded-2xl border-2 border-dashed border-white/5 bg-white/[0.01] flex flex-col items-center justify-center text-center p-8">
                    <div className="text-3xl mb-4 opacity-20">✨</div>
                    <p className="text-sm text-white/20">The processed output will appear here after you click the button.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}

function countDepth(obj: unknown, depth = 0): number {
  if (typeof obj !== 'object' || obj === null) return depth;
  const values = Object.values(obj as Record<string, unknown>);
  if (values.length === 0) return depth + 1;
  return Math.max(...values.map(v => countDepth(v, depth + 1)));
}

function countKeys(obj: unknown): number {
  if (typeof obj !== 'object' || obj === null) return 0;
  if (Array.isArray(obj)) return obj.reduce((a, v) => a + countKeys(v), 0);
  const keys = Object.keys(obj as object);
  return keys.length + Object.values(obj as object).reduce((a, v) => a + countKeys(v), 0);
}
