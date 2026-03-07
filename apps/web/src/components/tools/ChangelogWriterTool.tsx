'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import CodeBlock from '@/components/ui/CodeBlock';

type Category = 'features' | 'fixes' | 'breaking' | 'improvements';

interface Categorized {
  features: string[];
  fixes: string[];
  breaking: string[];
  improvements: string[];
}

const CATEGORY_PATTERNS: { key: Category; patterns: RegExp[] }[] = [
  {
    key: 'breaking',
    patterns: [/breaking/i, /removed?/i, /deprecat/i, /\bbreak\b/i, /BREAKING/],
  },
  {
    key: 'features',
    patterns: [/^feat/i, /add(ed)?/i, /new /i, /implement/i, /introduc/i, /support/i],
  },
  {
    key: 'fixes',
    patterns: [/^fix/i, /bug/i, /patch/i, /hotfix/i, /resolv/i, /correct/i, /repai/i],
  },
  {
    key: 'improvements',
    patterns: [/refactor/i, /improv/i, /updat/i, /enhanc/i, /optimi/i, /perf/i, /clean/i, /style/i, /chore/i, /docs?/i, /test/i],
  },
];

function categorize(raw: string): Categorized {
  const result: Categorized = { features: [], fixes: [], breaking: [], improvements: [] };
  const lines = raw.split('\n').map(l => l.trim()).filter(Boolean);

  for (const line of lines) {
    const clean = line.replace(/^[a-f0-9]{6,10}\s+/, '').replace(/^\*\s+/, '').replace(/^[-•]\s+/, '');
    if (!clean) continue;

    let matched = false;
    for (const cat of CATEGORY_PATTERNS) {
      if (cat.patterns.some(p => p.test(clean))) {
        result[cat.key].push(clean);
        matched = true;
        break;
      }
    }
    if (!matched) result.improvements.push(clean);
  }
  return result;
}

function renderChangelog(cat: Categorized, version: string, date: string): string {
  const sections: string[] = [];
  const fmt = (title: string, items: string[]) => {
    if (!items.length) return '';
    return `### ${title}\n${items.map(i => `- ${i}`).join('\n')}`;
  };

  if (cat.breaking.length) sections.push(fmt('Breaking Changes', cat.breaking));
  if (cat.features.length) sections.push(fmt('Features', cat.features));
  if (cat.fixes.length) sections.push(fmt('Bug Fixes', cat.fixes));
  if (cat.improvements.length) sections.push(fmt('Improvements', cat.improvements));

  return `## [${version}] — ${date}\n\n${sections.join('\n\n')}`;
}

const SAMPLE_INPUT = `feat: add dark mode toggle
fix: navbar overflow on mobile
refactor: extract utility functions
breaking: remove deprecated API endpoints
add user profile page
fix crash when uploading large files`;

export default function ChangelogWriterTool() {
  const [input, setInput] = useState(SAMPLE_INPUT);
  const [version, setVersion] = useState('1.0.0');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [output, setOutput] = useState('');

  const generate = () => {
    const cat = categorize(input);
    setOutput(renderChangelog(cat, version, date));
  };

  const download = () => {
    const blob = new Blob([output], { type: 'text/markdown' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'CHANGELOG.md';
    a.click();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
            <Card title="Release Meta">
                <div className="grid grid-cols-2 gap-4">
                    <Input label="Version" value={version} onChange={e => setVersion(e.target.value)} placeholder="1.0.0" />
                    <Input label="Release Date" type="date" value={date} onChange={e => setDate(e.target.value)} />
                </div>
            </Card>

            <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">Raw Activity Log</h3>
                    <Button variant="ghost" size="sm" onClick={() => setInput('')} className="h-7 text-[10px]">Clear</Button>
                </div>
                <Textarea 
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Paste git log or list of changes here..."
                    className="min-h-[300px] font-mono text-xs"
                />
            </div>

            <Button onClick={generate} className="w-full" size="lg" disabled={!input.trim()}>
                Categorize & Format
            </Button>
        </div>

        <div className="space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 px-1">Markdown Output</h3>
            {output ? (
                <div className="space-y-4 animate-in slide-in-from-right-4">
                    <CodeBlock code={output} language="markdown" maxHeight="500px" />
                    <div className="flex gap-3">
                        <Button variant="primary" className="flex-1" onClick={download}>Download .md</Button>
                        <Button variant="secondary" onClick={() => navigator.clipboard.writeText(output)}>Copy</Button>
                    </div>
                </div>
            ) : (
                <div className="h-[400px] rounded-3xl border-2 border-dashed border-white/5 bg-white/[0.01] flex flex-col items-center justify-center text-center p-12 opacity-20">
                    <div className="w-16 h-16 rounded-2xl bg-white/[0.03] flex items-center justify-center mb-4 text-2xl">📝</div>
                    <p className="text-sm">Formatted changelog will appear here</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
