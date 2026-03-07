'use client';

import { useState, useMemo } from 'react';
import Card from '@/components/ui/Card';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import CodeBlock from '@/components/ui/CodeBlock';
import Switch from '@/components/ui/Switch';

function formatEnv(raw: string, sort: boolean): string {
  const lines = raw.split('\n');
  const result: string[] = [];
  const entries: string[] = [];

  for (let line of lines) {
    line = line.trim();
    if (!line || line.startsWith('#')) {
      if (!sort) result.push(line);
      continue;
    }
    const idx = line.indexOf('=');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim().toUpperCase();
    const val = line.slice(idx + 1).trim();
    const formatted = `${key}=${val}`;
    if (sort) entries.push(formatted);
    else result.push(formatted);
  }

  if (sort) entries.sort();
  return (sort ? entries : result).join('\n');
}

export default function EnvFormatterTool() {
  const [input, setInput] = useState('PORT=3000\n# Database connection\nDATABASE_URL=postgres://localhost:5432/mydb\nnode_env=development\napi_key=123456');
  const [sort, setSort] = useState(true);
  const [output, setOutput] = useState('');

  const handleFormat = () => setOutput(formatEnv(input, sort));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
            <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">Raw .env Content</h3>
                    <Button variant="ghost" size="sm" onClick={() => { setInput(''); setOutput(''); }} className="h-7 text-[10px]">Clear</Button>
                </div>
                <Textarea 
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="KEY=value..."
                    className="min-h-[300px] font-mono text-sm"
                    spellCheck={false}
                />
            </div>

            <Card title="Formatting Options">
                <div className="space-y-4">
                    <Switch label="Sort Alphabetically" checked={sort} onChange={setSort} />
                    <Button onClick={handleFormat} className="w-full" size="lg" disabled={!input.trim()}>
                        Clean & Format
                    </Button>
                </div>
            </Card>
        </div>

        <div className="space-y-6 flex flex-col">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 px-1">Optimized Output</h3>
            {output ? (
                <div className="space-y-4 animate-in slide-in-from-right-4 duration-500">
                    <CodeBlock code={output} language="bash" maxHeight="450px" />
                    <Button variant="primary" className="w-full" size="lg" onClick={() => navigator.clipboard.writeText(output)}>
                        Copy .env File
                    </Button>
                </div>
            ) : (
                <div className="h-full min-h-[400px] rounded-3xl border-2 border-dashed border-white/5 bg-white/[0.01] flex flex-col items-center justify-center text-center p-12 opacity-20">
                    <div className="w-16 h-16 rounded-2xl bg-white/[0.03] flex items-center justify-center mb-4 text-2xl">📄</div>
                    <p className="text-sm">Formatted environment file will appear here</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
