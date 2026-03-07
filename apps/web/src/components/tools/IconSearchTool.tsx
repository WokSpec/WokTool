'use client';

import { useState, useMemo } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Tabs from '@/components/ui/Tabs';
import Button from '@/components/ui/Button';

interface IconDef {
  name: string;
  category: string;
  path: string;
}

const ICONS: IconDef[] = [
  // Arrows
  { name: 'ArrowUp', category: 'arrow', path: 'M12 19V5M5 12l7-7 7 7' },
  { name: 'ArrowDown', category: 'arrow', path: 'M12 5v14M19 12l-7 7-7-7' },
  { name: 'ArrowLeft', category: 'arrow', path: 'M19 12H5M12 5l-7 7 7 7' },
  { name: 'ArrowRight', category: 'arrow', path: 'M5 12h14M12 5l7 7-7 7' },
  { name: 'ChevronUp', category: 'arrow', path: 'M18 15l-6-6-6 6' },
  { name: 'ChevronDown', category: 'arrow', path: 'M6 9l6 6 6-6' },
  { name: 'ChevronLeft', category: 'arrow', path: 'M15 18l-6-6 6-6' },
  { name: 'ChevronRight', category: 'arrow', path: 'M9 18l6-6-6-6' },
  // Files
  { name: 'File', category: 'file', path: 'M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z M13 2v7h7' },
  { name: 'Folder', category: 'file', path: 'M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z' },
  { name: 'Download', category: 'file', path: 'M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4 M7 10l5 5 5-5 M12 15V3' },
  { name: 'Upload', category: 'file', path: 'M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4 M17 8l-5-5-5 5 M12 3v12' },
  { name: 'Copy', category: 'file', path: 'M20 9h-9a2 2 0 00-2 2v9a2 2 0 002 2h9a2 2 0 002-2v-9a2 2 0 00-2-2z M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1' },
  // Communication
  { name: 'Mail', category: 'comm', path: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6' },
  { name: 'Message', category: 'comm', path: 'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z' },
  { name: 'Bell', category: 'comm', path: 'M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 01-3.46 0' },
  // UI
  { name: 'Search', category: 'ui', path: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
  { name: 'Settings', category: 'ui', path: 'M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z' },
  { name: 'Home', category: 'ui', path: 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10' },
  { name: 'X', category: 'ui', path: 'M18 6L6 18 M6 6l12 12' },
  { name: 'Check', category: 'ui', path: 'M20 6L9 17l-5-5' },
  { name: 'Info', category: 'ui', path: 'M12 2a10 10 0 100 20A10 10 0 0012 2z M12 16v-4 M12 8h.01' },
  // Media
  { name: 'Play', category: 'media', path: 'M5 3l14 9-14 9V3z' },
  { name: 'Volume', category: 'media', path: 'M11 5L6 9H2v6h4l5 4V5z M19.07 4.93a10 10 0 010 14.14 M15.54 8.46a5 5 0 010 7.07' },
  { name: 'Star', category: 'media', path: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' },
];

const CATEGORIES = [
    { value: 'all', label: 'All' },
    { value: 'arrow', label: 'Arrows' },
    { value: 'file', label: 'Files' },
    { value: 'comm', label: 'Comm' },
    { value: 'ui', label: 'UI' },
    { value: 'media', label: 'Media' },
];

type Format = 'svg' | 'jsx' | 'name';

export default function IconSearchTool() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [format, setFormat] = useState<Format>('svg');
  const [copied, setCopied] = useState<string | null>(null);

  const filtered = useMemo(() => ICONS.filter(icon => {
    const matchQ = !query || icon.name.toLowerCase().includes(query.toLowerCase());
    const matchC = category === 'all' || icon.category === category;
    return matchQ && matchC;
  }), [query, category]);

  const copy = (icon: IconDef) => {
    let text = '';
    if (format === 'svg') text = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="${icon.path}" /></svg>`;
    else if (format === 'jsx') text = `<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="${icon.path}" /></svg>`;
    else text = icon.name;
    
    navigator.clipboard.writeText(text);
    setCopied(icon.name);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar: Filters */}
        <div className="space-y-6">
            <Card title="Search & Filter">
                <div className="space-y-6">
                    <Input 
                        placeholder="Search icons..."
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        leftIcon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>}
                    />
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-white/20 tracking-widest px-1">Categories</label>
                        <div className="grid grid-cols-2 gap-2">
                            {CATEGORIES.map(c => (
                                <button
                                    key={c.value}
                                    onClick={() => setCategory(c.value)}
                                    className={`py-2 px-3 rounded-xl text-[10px] font-bold border transition-all ${category === c.value ? 'bg-accent border-accent text-white shadow-lg' : 'bg-surface-raised border-white/5 text-white/40 hover:text-white'}`}
                                >
                                    {c.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </Card>

            <Card title="Copy Settings">
                <div className="flex bg-white/5 p-1 rounded-xl">
                    {(['svg','jsx','name'] as Format[]).map(f => (
                        <button
                            key={f}
                            onClick={() => setFormat(f)}
                            className={`flex-1 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${format === f ? 'bg-accent text-white shadow-md' : 'text-white/30 hover:text-white/60'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </Card>
        </div>

        {/* Main: Grid */}
        <div className="lg:col-span-3 space-y-6">
            <div className="flex justify-between items-center px-1">
                <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">{filtered.length} Icons Found</h3>
                <span className="text-[10px] text-white/20 italic">Click to copy as {format.toUpperCase()}</span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {filtered.map(icon => (
                    <button
                        key={icon.name}
                        onClick={() => copy(icon)}
                        className={`group flex flex-col items-center justify-center p-4 rounded-2xl border transition-all aspect-square ${copied === icon.name ? 'bg-success border-success text-white shadow-[0_0_20px_rgba(34,197,94,0.3)]' : 'bg-surface-raised border-white/5 hover:border-white/10 text-white/40 hover:text-white'}`}
                    >
                        <svg 
                            viewBox="0 0 24 24" 
                            className={`w-8 h-8 transition-transform group-hover:scale-110 duration-300 ${copied === icon.name ? 'text-white' : 'text-current opacity-80'}`} 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth={2} 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                        >
                            <path d={icon.path} />
                        </svg>
                        <span className="mt-3 text-[9px] font-bold uppercase tracking-tighter truncate w-full text-center">
                            {copied === icon.name ? 'Copied!' : icon.name}
                        </span>
                    </button>
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="h-64 rounded-3xl border-2 border-dashed border-white/5 bg-white/[0.01] flex flex-col items-center justify-center text-center opacity-20">
                    <p className="text-sm">No icons match your search</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
