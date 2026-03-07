'use client';

import { useState, useMemo } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import CodeBlock from '@/components/ui/CodeBlock';

interface Badge {
  name: string;
  color: string;
  logo: string;
  category: string;
}

const BADGES: Badge[] = [
  { name: 'React', color: '20232a', logo: 'react', category: 'Frontend' },
  { name: 'Next.js', color: 'black', logo: 'next.js', category: 'Frontend' },
  { name: 'TypeScript', color: '3178c6', logo: 'typescript', category: 'Language' },
  { name: 'Tailwind CSS', color: '38b2ac', logo: 'tailwind-css', category: 'Frontend' },
  { name: 'Node.js', color: '339933', logo: 'node.js', category: 'Backend' },
  { name: 'Python', color: '3776ab', logo: 'python', category: 'Language' },
  { name: 'Rust', color: '000000', logo: 'rust', category: 'Language' },
  { name: 'Go', color: '00add8', logo: 'go', category: 'Language' },
  { name: 'PostgreSQL', color: '4169e1', logo: 'postgresql', category: 'Database' },
  { name: 'Redis', color: 'dc382d', logo: 'redis', category: 'Database' },
  { name: 'Docker', color: '2496ed', logo: 'docker', category: 'DevOps' },
  { name: 'AWS', color: '232f3e', logo: 'amazon-aws', category: 'DevOps' },
  { name: 'Vercel', color: '000000', logo: 'vercel', category: 'DevOps' },
  { name: 'Cloudflare', color: 'f38020', logo: 'cloudflare', category: 'DevOps' },
];

const STYLES = [
    { value: 'for-the-badge', label: 'For the Badge' },
    { value: 'flat', label: 'Flat' },
    { value: 'flat-square', label: 'Flat Square' },
    { value: 'plastic', label: 'Plastic' },
];

export default function TechBadgesTool() {
  const [selected, setSelected] = useState<string[]>([]);
  const [style, setStyle] = useState('for-the-badge');
  const [query, setQuery] = useState('');

  const toggle = (name: string) => {
    setSelected(prev => prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]);
  };

  const markdown = useMemo(() => {
    return selected.map(name => {
      const b = BADGES.find(x => x.name === name)!;
      return `![${b.name}](https://img.shields.io/badge/${encodeURIComponent(b.name)}-${b.color}?style=${style}&logo=${b.logo}&logoColor=white)`;
    }).join('\n');
  }, [selected, style]);

  const filtered = BADGES.filter(b => b.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
            <Card title="Configuration">
                <div className="space-y-6">
                    <Select 
                        label="Badge Style"
                        value={style}
                        onChange={e => setStyle(e.target.value)}
                        options={STYLES}
                    />
                    <Input 
                        placeholder="Filter tech..."
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        leftIcon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>}
                    />
                </div>
            </Card>

            {selected.length > 0 && (
                <div className="space-y-4 animate-in slide-in-from-left-4">
                    <div className="flex justify-between items-center px-1">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">Markdown Result</h3>
                        <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(markdown)} className="h-7 text-[10px]">Copy All</Button>
                    </div>
                    <CodeBlock code={markdown} language="markdown" maxHeight="250px" />
                </div>
            )}
        </div>

        <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 px-1">Select Technologies ({selected.length} active)</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {filtered.map(b => (
                    <button
                        key={b.name}
                        onClick={() => toggle(b.name)}
                        className={`group flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${selected.includes(b.name) ? 'bg-accent/10 border-accent/40 shadow-inner ring-1 ring-accent/20' : 'bg-surface-raised border-white/5 hover:border-white/10 hover:bg-white/[0.02]'}`}
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                            src={`https://img.shields.io/badge/${encodeURIComponent(b.name)}-${b.color}?style=${style}&logo=${b.logo}&logoColor=white`} 
                            alt={b.name}
                            className="max-w-full h-auto mb-3 pointer-events-none"
                        />
                        <span className={`text-[10px] font-black uppercase tracking-tighter ${selected.includes(b.name) ? 'text-accent' : 'text-white/20'}`}>{b.name}</span>
                    </button>
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="h-48 rounded-3xl border-2 border-dashed border-white/5 bg-white/[0.01] flex items-center justify-center text-white/20 text-sm">
                    No matching technologies found
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
