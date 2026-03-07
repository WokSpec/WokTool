'use client';

import Link from 'next/link';
import { useState, useMemo, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Search, X, Star, Zap, Clock, Grid, ChevronRight, Activity, Command, 
  Youtube, Layers, RefreshCw, Maximize, PenTool, Code, Palette, Type, 
  Monitor, FileJson, Lock, ShieldCheck, Key, FileText, Share2, Edit3, 
  Save, Globe, Box, Download, Music, Video, Info, ArrowRight, Sparkles,
  LayoutGrid, Terminal, Cpu, Network, Shield, MousePointer2, Github
} from 'lucide-react';
import { TOOLS, TAG_LABELS } from '@/lib/tools-registry';
import type { ToolTag, ToolDef } from '@/lib/tools-registry';
import Button from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES: Array<{ tag: ToolTag | null; label: string; icon: any }> = [
  { tag: null,       label: 'All Modules', icon: LayoutGrid },
  { tag: 'image',   label: 'Imaging',      icon: Layers },
  { tag: 'design',  label: 'Design',       icon: Palette },
  { tag: 'dev',     label: 'Engineering',   icon: Code },
  { tag: 'audio',   label: 'Media',        icon: Music },
  { tag: 'crypto',  label: 'Web3',         icon: Activity },
  { tag: 'utility', label: 'Workflow',     icon: Zap },
  { tag: 'security', label: 'Security',     icon: Shield },
  { tag: 'network',  label: 'Network',      icon: Network },
];

const ICON_MAP: Record<string, any> = {
  Youtube, Layers, RefreshCw, Zap, Maximize, PenTool, Code, Palette, Type, 
  Monitor, FileJson, Search, Globe, Box, Lock, ShieldCheck, Key, FileText, 
  Activity, Share2, Edit3, Clock, Save, Music, Video, Info, Shield, Network
};

function ToolIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICON_MAP[name] || Grid;
  return <Icon className={className} />;
}

export default function ToolsHubClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(() => searchParams.get('q') ?? '');
  const [activeTag, setActiveTag] = useState<ToolTag | null>(() => (searchParams.get('category') as ToolTag | null) ?? null);
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const [starredIds, setStarredIds] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      setRecentIds(JSON.parse(localStorage.getItem('toolhub-recent') ?? '[]'));
      setStarredIds(JSON.parse(localStorage.getItem('toolhub-starred') ?? '[]'));
    } catch { }
  }, []);

  const syncUrl = useCallback((tag: ToolTag | null, q: string) => {
    const params = new URLSearchParams();
    if (tag) params.set('category', tag);
    if (q.trim()) params.set('q', q.trim());
    const qs = params.toString();
    router.replace(qs ? `/?${qs}` : '/', { scroll: false });
  }, [router]);

  const handleCategoryChange = (tag: ToolTag | null) => {
    setActiveTag(tag);
    syncUrl(tag, search);
  };

  const handleSearch = (q: string) => {
    setSearch(q);
    syncUrl(activeTag, q);
  };

  const trackRecent = (id: string) => {
    setRecentIds(prev => {
      const next = [id, ...prev.filter(x => x !== id)].slice(0, 12);
      localStorage.setItem('toolhub-recent', JSON.stringify(next));
      return next;
    });
  };

  const filtered = useMemo(() => {
    let list = TOOLS;
    if (activeTag) list = list.filter(t => t.tags.includes(activeTag));
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(t => t.label.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.tags.some(tag => tag.toLowerCase().includes(q)));
    }
    return list;
  }, [search, activeTag]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-bg-base text-white/90">
      {/* Hero Section */}
      <section className="relative pt-48 pb-24 px-6 lg:px-12 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-[0.1] pointer-events-none" />
        <div className="max-w-[1440px] mx-auto relative z-10">
            <motion.div 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-12"
            >
                <div className="space-y-4">
                    <span className="label-tech text-accent animate-pulse">Protocol Version 4.2.1 Stable</span>
                    <h1 className="text-6xl lg:text-[140px] font-black leading-[0.8] tracking-[-0.06em]">
                        ENGINEERED <br/>
                        <span className="text-white/20">UTILITIES.</span>
                    </h1>
                </div>

                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
                    <p className="max-w-xl text-lg lg:text-xl text-white/40 font-medium leading-relaxed">
                        80+ professional-grade developer modules. 100% browser-native, private by design, and optimized for high-performance workflows.
                    </p>
                    
                    <div className="relative group w-full lg:w-[500px]">
                        <input 
                            type="text"
                            placeholder="INITIALIZE MODULE..."
                            value={search}
                            onChange={e => handleSearch(e.target.value)}
                            className="input-v !rounded-none !bg-white/5 !border-white/10 focus:!border-accent uppercase tracking-widest text-xs"
                        />
                        <Search size={16} className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-accent transition-colors" />
                    </div>
                </div>
            </motion.div>
        </div>
      </section>

      {/* Marquee Section */}
      <div className="marquee-container">
        <div className="marquee-content">
            {TOOLS.slice(0, 20).map(t => (
                <Link key={t.id} href={t.href} className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-accent transition-colors">
                    {t.label} <ToolIcon name={t.icon} className="w-3 h-3" />
                </Link>
            ))}
        </div>
        <div className="marquee-content" aria-hidden="true">
            {TOOLS.slice(0, 20).map(t => (
                <Link key={`${t.id}-clone`} href={t.href} className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-accent transition-colors">
                    {t.label} <ToolIcon name={t.icon} className="w-3 h-3" />
                </Link>
            ))}
        </div>
      </div>

      {/* Main Grid Section */}
      <section className="max-w-[1440px] mx-auto px-6 lg:px-12 py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
            {/* Sidebar Categories */}
            <aside className="lg:col-span-3 space-y-16">
                <div className="space-y-8">
                    <div className="flex items-center gap-4">
                        <span className="text-[10px] font-mono text-accent">01</span>
                        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-white">Categories</h2>
                    </div>
                    <nav className="flex flex-col border-l border-white/5">
                        {CATEGORIES.map(c => (
                            <button
                                key={c.label}
                                onClick={() => handleCategoryChange(c.tag)}
                                className={`group flex items-center justify-between px-6 py-4 text-[11px] font-black uppercase tracking-widest transition-all border-b border-white/5 hover:bg-white/[0.02] ${activeTag === c.tag ? 'text-accent border-l-2 border-l-accent -ml-[1px] bg-white/[0.03]' : 'text-white/30 hover:text-white'}`}
                            >
                                {c.label}
                                <ArrowRight size={12} className={`transition-transform duration-500 ${activeTag === c.tag ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`} />
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="p-8 border border-white/10 bg-white/[0.02] space-y-4">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Network Status</span>
                    </div>
                    <p className="text-[11px] font-bold text-zinc-500 leading-relaxed uppercase tracking-tight">
                        All modules are verified for edge deployment. 100% Client-side isolation active.
                    </p>
                </div>
            </aside>

            {/* Modules Grid */}
            <div className="lg:col-span-9 space-y-12">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <span className="text-[10px] font-mono text-accent">02</span>
                        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-white">
                            {activeTag ? TAG_LABELS[activeTag] : 'Active Registry'}
                        </h2>
                    </div>
                    <span className="text-[10px] font-black font-mono text-white/20 tracking-tighter">{filtered.length} PROTOCOLS LOADED</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[1px] bg-white/10 border border-white/10">
                    <AnimatePresence mode="popLayout">
                        {filtered.map(t => (
                            <motion.div
                                key={t.id}
                                layout
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="bg-bg-base group p-8 hover:bg-white/[0.02] transition-colors relative"
                            >
                                <Link href={t.href} onClick={() => trackRecent(t.id)} className="block space-y-8">
                                    <div className="flex items-start justify-between">
                                        <div className="w-10 h-10 border border-white/10 flex items-center justify-center text-white/20 group-hover:text-accent group-hover:border-accent/40 transition-all duration-500">
                                            <ToolIcon name={t.icon} className="w-5 h-5" />
                                        </div>
                                        {t.isNew && <span className="text-[8px] font-black uppercase tracking-[0.3em] text-accent px-2 py-1 border border-accent/20 bg-accent/5">New</span>}
                                    </div>
                                    
                                    <div className="space-y-3">
                                        <h3 className="text-lg font-black uppercase tracking-tight group-hover:text-white transition-colors">{t.label}</h3>
                                        <p className="text-xs text-white/30 font-medium leading-relaxed line-clamp-2">
                                            {t.description}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-white/10 group-hover:text-white/40 transition-colors pt-4">
                                        Initialize <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {filtered.length === 0 && (
                    <div className="py-40 flex flex-col items-center justify-center text-center space-y-8 border border-dashed border-white/10">
                        <div className="text-4xl opacity-20">NO_MATCH</div>
                        <p className="text-xs font-black uppercase tracking-widest text-white/20">Protocol could not locate matching module.</p>
                        <Button onClick={() => { handleSearch(''); handleCategoryChange(null); }} variant="secondary">Reset Parameters</Button>
                    </div>
                )}
            </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-bg-subtle py-32 px-6 lg:px-12">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-24">
            <div className="lg:col-span-6 space-y-12">
                <div className="space-y-6">
                    <span className="text-2xl font-black uppercase tracking-tighter">WokTool</span>
                    <p className="max-w-md text-white/30 font-medium leading-relaxed uppercase tracking-tight text-sm">
                        Open tools. Honest work. A high-fidelity utility ecosystem for the modern engineering workflow.
                    </p>
                </div>
                <div className="flex gap-8">
                    <a href="https://github.com/WokSpec/WokTool" target="_blank" rel="noopener noreferrer" className="label-tech hover:text-white transition-colors">GitHub</a>
                    <a href="https://wokspec.org" target="_blank" rel="noopener noreferrer" className="label-tech hover:text-white transition-colors">WokSpec.org</a>
                    <a href="#" className="label-tech hover:text-white transition-colors">Status</a>
                </div>
            </div>

            <div className="lg:col-span-6 grid grid-cols-2 gap-12">
                <div className="space-y-8">
                    <h4 className="label-tech text-white/60">Core Ecosystem</h4>
                    <nav className="flex flex-col gap-4 text-xs font-black uppercase tracking-widest text-white/20">
                        <a href="#" className="hover:text-white transition-colors">Module Registry</a>
                        <a href="#" className="hover:text-white transition-colors">Technical Docs</a>
                        <a href="#" className="hover:text-white transition-colors">API Blueprint</a>
                    </nav>
                </div>
                <div className="space-y-8">
                    <h4 className="label-tech text-white/60">Legal Protocol</h4>
                    <nav className="flex flex-col gap-4 text-xs font-black uppercase tracking-widest text-white/20">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-white transition-colors">Data Isolation</a>
                    </nav>
                </div>
            </div>
        </div>
        <div className="max-w-[1440px] mx-auto mt-32 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/10">© 2026 WokSpec Global Protocol · INDUSTRIAL_PREMIUM_V4_OVERHAUL</p>
            <div className="flex items-center gap-4 text-[10px] font-mono text-white/20">
                <span>BUILD_SIG: {new Date().toISOString().split('T')[0]}_STABLE</span>
                <span>ENC: AES-256-GCM</span>
            </div>
        </div>
      </footer>
    </div>
  );
}
