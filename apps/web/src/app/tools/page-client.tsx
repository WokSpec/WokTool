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

const CATEGORIES: Array<{ tag: ToolTag | null; label: string; icon: any; color: string }> = [
  { tag: null,       label: 'All Modules', icon: LayoutGrid, color: 'oklch(100% 0 0)' },
  { tag: 'image',   label: 'Imaging',      icon: Layers,     color: 'oklch(70% 0.2 340)' },
  { tag: 'design',  label: 'Design',       icon: Palette,    color: 'oklch(75% 0.15 280)' },
  { tag: 'dev',     label: 'Engineering',   icon: Code,       color: 'oklch(70% 0.15 200)' },
  { tag: 'audio',   label: 'Media',        icon: Music,      color: 'oklch(75% 0.2 40)' },
  { tag: 'crypto',  label: 'Web3',         icon: Activity,   color: 'oklch(80% 0.15 80)' },
  { tag: 'utility', label: 'Workflow',     icon: Zap,        color: 'oklch(85% 0.2 100)' },
  { tag: 'security', label: 'Security',     icon: Shield,     color: 'oklch(60% 0.2 20)' },
  { tag: 'network',  label: 'Network',      icon: Network,    color: 'oklch(65% 0.15 240)' },
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

function ToolCard({ tool, starred, onStar, onVisit }: { tool: ToolDef; starred: boolean; onStar: any; onVisit: any }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        href={tool.href}
        onClick={() => onVisit(tool.id)}
        className="card-v h-full flex flex-col group"
      >
        <div className="flex items-start justify-between mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.03] border border-white/[0.08] transition-all duration-500 group-hover:scale-110 group-hover:bg-accent/10 group-hover:border-accent/30 group-hover:shadow-[0_0_20px_rgba(var(--color-accent),0.1)]">
            <ToolIcon name={tool.icon} className="w-6 h-6 text-zinc-400 group-hover:text-accent transition-colors" />
          </div>
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onStar(tool.id); }}
            className={`p-2 rounded-xl transition-all ${starred ? 'text-yellow-500 bg-yellow-500/10' : 'text-zinc-700 hover:text-white hover:bg-white/5'}`}
          >
            <Star size={14} fill={starred ? 'currentColor' : 'none'} />
          </button>
        </div>

        <div className="flex-1">
          <h3 className="text-[15px] font-bold text-white mb-2 flex items-center gap-2 tracking-tight group-hover:text-accent transition-colors">
              {tool.label}
              <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
          </h3>
          <p className="text-[13px] text-zinc-500 leading-relaxed line-clamp-2 font-medium group-hover:text-zinc-400 transition-colors">
            {tool.description}
          </p>
        </div>

        <div className="mt-6 pt-4 border-t border-white/[0.04] flex items-center justify-between">
            <div className="flex gap-1">
                {tool.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="text-[9px] font-black uppercase tracking-widest text-zinc-600 px-2 py-0.5 rounded-full bg-white/[0.02] border border-white/[0.04]">
                        {tag}
                    </span>
                ))}
            </div>
            {tool.isNew && (
              <span className="flex items-center gap-1 text-accent text-[9px] font-black uppercase tracking-widest">
                <Sparkles size={10} /> New
              </span>
            )}
        </div>
      </Link>
    </motion.div>
  );
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

  const toggleStar = (id: string) => {
    setStarredIds(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      localStorage.setItem('toolhub-starred', JSON.stringify(next));
      return next;
    });
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

  const recentTools = recentIds.map(id => TOOLS.find(t => t.id === id)).filter(Boolean) as ToolDef[];
  const starredTools = starredIds.map(id => TOOLS.find(t => t.id === id)).filter(Boolean) as ToolDef[];

  if (!mounted) return null;

  return (
    <div className="flex min-h-screen bg-bg-base text-white/90 font-sans selection:bg-accent/30 selection:text-white">
      {/* ── Left Navigation (Command Center) ─────────────────────────── */}
      <aside className="fixed left-0 top-14 bottom-0 w-[280px] hidden xl:flex flex-col border-r border-border-subtle bg-bg-base/50 backdrop-blur-md p-6 z-40">
        <div className="space-y-12">
            <div className="space-y-4">
                <div className="flex items-center justify-between px-3">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Categories</span>
                    <div className="h-[1px] flex-1 ml-4 bg-border-subtle" />
                </div>
                <nav className="space-y-1">
                    {CATEGORIES.map(c => {
                        const Icon = c.icon;
                        const isActive = activeTag === c.tag;
                        return (
                            <button
                                key={c.label}
                                onClick={() => handleCategoryChange(c.tag)}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-[13px] font-bold transition-all group relative overflow-hidden ${isActive ? 'bg-white/5 text-white shadow-inner' : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.02]'}`}
                            >
                                <span className="flex items-center gap-3 relative z-10">
                                    <Icon size={16} className={`transition-all duration-300 ${isActive ? 'text-accent' : 'text-zinc-600 group-hover:text-zinc-400'}`} />
                                    {c.label}
                                </span>
                                {isActive && (
                                    <motion.div layoutId="active-nav" className="absolute left-0 w-1 h-6 bg-accent rounded-full" />
                                )}
                            </button>
                        );
                    })}
                </nav>
            </div>

            {(recentTools.length > 0 || starredTools.length > 0) && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-3">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">My Workspace</span>
                        <div className="h-[1px] flex-1 ml-4 bg-border-subtle" />
                    </div>
                    <nav className="space-y-1">
                        {starredTools.length > 0 && (
                            <button onClick={() => { setActiveTag(null); setSearch(''); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[13px] font-bold text-zinc-500 hover:text-white hover:bg-white/[0.02] transition-all group">
                                <Star size={16} className="text-yellow-500/40 group-hover:text-yellow-500 transition-colors" /> Favorites
                            </button>
                        )}
                        {recentTools.length > 0 && (
                            <button onClick={() => { setActiveTag(null); setSearch(''); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[13px] font-bold text-zinc-500 hover:text-white hover:bg-white/[0.02] transition-all group">
                                <Clock size={16} className="text-accent/60 group-hover:text-accent transition-colors" /> Recently Used
                            </button>
                        )}
                    </nav>
                </div>
            )}
        </div>

        <div className="mt-auto pt-6 border-t border-border-subtle">
            <div className="px-4 py-4 rounded-2xl bg-gradient-to-br from-white/[0.03] to-transparent border border-white/[0.06]">
                <div className="flex items-center gap-2 mb-2">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">System Status</span>
                </div>
                <div className="text-[11px] font-bold text-zinc-400">All modules fully operational. Client-side isolated.</div>
            </div>
        </div>
      </aside>

      {/* ── Main Workspace ─────────────────────────────────────────── */}
      <main className="flex-1 xl:pl-[280px] bg-bg-base relative min-h-screen">
        <div className="absolute inset-0 bg-grid opacity-[0.15] pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-accent/5 to-transparent pointer-events-none" />

        {/* Hero Welcome Section */}
        <section className="relative px-6 pt-20 pb-16 lg:px-12 lg:pt-32 lg:pb-24 max-w-6xl mx-auto z-10">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-12"
            >
                <div className="space-y-6 max-w-3xl">
                    <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-[11px] font-black uppercase tracking-[0.2em] animate-pulse">
                        <Sparkles size={14} /> New Protocol V4 Active
                    </div>
                    <h1 className="text-5xl lg:text-8xl font-black text-white tracking-tight leading-[0.85]">
                        The Professional <br/>
                        <span className="text-zinc-600">Toolbox.</span>
                    </h1>
                    <p className="text-lg lg:text-2xl text-zinc-400 font-medium leading-relaxed">
                        80+ high-fidelity developer and design utilities. 100% browser-side, zero data retention, industrial grade performance.
                    </p>
                </div>

                <div className="relative group max-w-3xl">
                    <div className="absolute -inset-1 bg-gradient-to-r from-accent/30 to-white/10 rounded-3xl blur-xl opacity-0 group-focus-within:opacity-100 transition duration-1000" />
                    <div className="relative flex items-center">
                        <input 
                            type="text"
                            placeholder="Initialize module by name or tag (e.g. 'image', 'aes')..."
                            value={search}
                            onChange={e => handleSearch(e.target.value)}
                            className="w-full h-20 text-xl lg:text-2xl pl-16 pr-8 rounded-3xl bg-bg-surface border border-border-strong text-white placeholder:text-zinc-700 focus:outline-none focus:ring-4 focus:ring-accent/10 focus:border-accent/40 transition-all shadow-2xl"
                        />
                        <Search size={28} className="absolute left-6 text-zinc-700 group-focus-within:text-accent transition-colors" />
                        {search && (
                            <button onClick={() => handleSearch('')} className="absolute right-6 p-2 text-zinc-500 hover:text-white transition-colors bg-white/5 rounded-xl">
                                <X size={20} />
                            </button>
                        )}
                        <div className="absolute right-20 hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                            <span className="text-zinc-700 font-black">CTRL</span> K
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 self-center mr-2">Top Tags:</span>
                    {['image', 'design', 'dev', 'security', 'utility'].map(tag => (
                        <button
                            key={tag}
                            onClick={() => handleSearch(tag)}
                            className="px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[11px] font-bold text-zinc-400 uppercase tracking-widest hover:bg-white/10 hover:border-accent/30 transition-all hover:-translate-y-0.5"
                        >
                            #{tag}
                        </button>
                    ))}
                </div>
            </motion.div>
        </section>

        {/* Dynamic Content Area */}
        <section className="px-6 lg:px-12 pb-32 max-w-[1440px] mx-auto space-y-24 z-10 relative">
            {/* Featured Section (when no search/filter) */}
            {!activeTag && !search && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Link href="/tools/screen-recorder" className="relative group overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-accent/20 to-bg-subtle border border-accent/20 p-10 h-80 flex flex-col justify-between hover:border-accent/40 transition-all">
                        <div className="absolute -right-20 -top-20 w-64 h-64 bg-accent/10 rounded-full blur-3xl group-hover:bg-accent/20 transition-all duration-700" />
                        <div className="space-y-4 relative z-10">
                            <div className="h-14 w-14 rounded-2xl bg-accent flex items-center justify-center text-white shadow-2xl shadow-accent/40">
                                <Monitor size={28} />
                            </div>
                            <h2 className="text-4xl font-black text-white tracking-tight">Screen Recorder</h2>
                            <p className="text-zinc-400 font-medium max-w-xs">Professional browser-based capture. No installation required. Export high-fidelity WebM.</p>
                        </div>
                        <div className="flex items-center gap-2 text-accent text-sm font-black uppercase tracking-widest relative z-10">
                            Launch Module <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                        </div>
                    </Link>

                    <div className="grid grid-cols-2 gap-6 h-80">
                        <Link href="/tools/background-remover" className="group rounded-[2rem] bg-bg-surface border border-border-strong p-8 flex flex-col justify-between hover:bg-white/[0.03] transition-all">
                            <Layers size={32} className="text-zinc-500 group-hover:text-white transition-colors" />
                            <div className="space-y-2">
                                <h3 className="font-bold text-white">BG Remover</h3>
                                <p className="text-[11px] text-zinc-600 uppercase font-black tracking-widest">AI Isolated</p>
                            </div>
                        </Link>
                        <Link href="/tools/aes-tool" className="group rounded-[2rem] bg-bg-surface border border-border-strong p-8 flex flex-col justify-between hover:bg-white/[0.03] transition-all">
                            <Lock size={32} className="text-zinc-500 group-hover:text-white transition-colors" />
                            <div className="space-y-2">
                                <h3 className="font-bold text-white">Encryption</h3>
                                <p className="text-[11px] text-zinc-600 uppercase font-black tracking-widest">AES-256 GCM</p>
                            </div>
                        </Link>
                        <Link href="/tools/svg-to-jsx" className="group rounded-[2rem] bg-bg-surface border border-border-strong p-8 flex flex-col justify-between hover:bg-white/[0.03] transition-all">
                            <Code size={32} className="text-zinc-500 group-hover:text-white transition-colors" />
                            <div className="space-y-2">
                                <h3 className="font-bold text-white">SVG to JSX</h3>
                                <p className="text-[11px] text-zinc-600 uppercase font-black tracking-widest">React Ready</p>
                            </div>
                        </Link>
                        <Link href="/tools/color-tools" className="group rounded-[2rem] bg-bg-surface border border-border-strong p-8 flex flex-col justify-between hover:bg-white/[0.03] transition-all">
                            <Palette size={32} className="text-zinc-500 group-hover:text-white transition-colors" />
                            <div className="space-y-2">
                                <h3 className="font-bold text-white">Architect</h3>
                                <p className="text-[11px] text-zinc-600 uppercase font-black tracking-widest">Color Sync</p>
                            </div>
                        </Link>
                    </div>
                </div>
            )}

            {/* Recents Bar */}
            {recentTools.length > 0 && !search && !activeTag && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-6 w-1 bg-accent/40 rounded-full" />
                            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-500">Recently Utilized</h2>
                        </div>
                        <button onClick={() => { localStorage.removeItem('toolhub-recent'); setRecentIds([]); }} className="text-[10px] font-bold text-zinc-700 hover:text-white uppercase tracking-widest transition-colors">Clear History</button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {recentTools.slice(0, 4).map(t => (
                            <ToolCard key={t.id} tool={t} starred={starredIds.includes(t.id)} onStar={toggleStar} onVisit={trackRecent} />
                        ))}
                    </div>
                </div>
            )}

            {/* Main Result Area */}
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-6 w-1 bg-border-strong rounded-full" />
                        <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-500">
                            {activeTag ? TAG_LABELS[activeTag] : (search ? 'Protocol Matches' : 'Full Utility Registry')}
                        </h2>
                    </div>
                    <span className="text-[10px] font-black font-mono text-zinc-800 tracking-tighter">{filtered.length} ACTIVE MODULES</span>
                </div>

                <motion.div 
                    layout
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                    <AnimatePresence mode="popLayout">
                        {filtered.map(t => (
                            <ToolCard key={t.id} tool={t} starred={starredIds.includes(t.id)} onStar={toggleStar} onVisit={trackRecent} />
                        ))}
                    </AnimatePresence>
                </motion.div>

                {filtered.length === 0 && (
                    <div className="py-40 flex flex-col items-center justify-center text-center space-y-8 glass rounded-[3rem]">
                        <div className="w-24 h-24 rounded-[2.5rem] bg-white/[0.02] border border-dashed border-white/10 flex items-center justify-center text-5xl opacity-20">🔍</div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-black text-white tracking-tight">Module Not Found</h3>
                            <p className="text-zinc-500 max-w-xs mx-auto">The protocol could not locate a module matching your current search parameters.</p>
                        </div>
                        <Button onClick={() => { handleSearch(''); handleCategoryChange(null); }} variant="secondary" size="md">Reset Search Parameters</Button>
                    </div>
                )}
            </div>
        </section>

        {/* Workspace Footer */}
        <footer className="border-t border-border-subtle bg-bg-surface/50 backdrop-blur-xl p-12 lg:p-24 relative overflow-hidden">
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="max-w-6xl mx-auto flex flex-col lg:flex-row justify-between items-start lg:items-center gap-16 relative z-10">
                <div className="space-y-6 flex-1">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-xl bg-white flex items-center justify-center font-black text-black">W</div>
                        <span className="text-xl font-black uppercase tracking-tighter text-white">WokTool</span>
                    </div>
                    <p className="text-zinc-500 max-w-sm font-medium leading-relaxed">
                        A decentralized utility hub by WokSpec. Open source, privacy-first, and built for the next generation of digital builders.
                    </p>
                    <div className="flex gap-4">
                        <a href="https://github.com/WokSpec/WokTool" target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/10 transition-all">
                            <Github size={20} />
                        </a>
                        <a href="https://wokspec.org" target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/10 transition-all">
                            <Globe size={20} />
                        </a>
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 lg:gap-24">
                    <div className="space-y-6">
                        <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-accent">Ecosystem</h4>
                        <nav className="flex flex-col gap-4">
                            <a href="#" className="text-xs font-bold text-zinc-500 hover:text-white transition-colors">WokSpec Main</a>
                            <a href="#" className="text-xs font-bold text-zinc-500 hover:text-white transition-colors">Module Registry</a>
                            <a href="#" className="text-xs font-bold text-zinc-500 hover:text-white transition-colors">Open Source</a>
                        </nav>
                    </div>
                    <div className="space-y-6">
                        <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-white">Resources</h4>
                        <nav className="flex flex-col gap-4">
                            <a href="#" className="text-xs font-bold text-zinc-500 hover:text-white transition-colors">Documentation</a>
                            <a href="#" className="text-xs font-bold text-zinc-500 hover:text-white transition-colors">API Reference</a>
                            <a href="#" className="text-xs font-bold text-zinc-500 hover:text-white transition-colors">Privacy Policy</a>
                        </nav>
                    </div>
                </div>
            </div>
            <div className="max-w-6xl mx-auto mt-24 pt-8 border-t border-white/[0.04] flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-[10px] text-zinc-700 font-black uppercase tracking-widest">© 2026 WokSpec Global Protocol · Verified for production</p>
                <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-800 uppercase tracking-widest">
                    <span>Build 4.2.1-stable</span>
                    <div className="h-1 w-1 rounded-full bg-zinc-800" />
                    <span>Edge Optimized</span>
                </div>
            </div>
        </footer>
      </main>
    </div>
  );
}
